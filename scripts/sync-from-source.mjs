#!/usr/bin/env node
/**
 * Pulls derivable reference artifacts from the upstream OpenTRMS repos into
 * the docs tree. Run via `npm run sync`.
 *
 * This script must never throw: if a source is missing, it warns and writes
 * a graceful placeholder instead of failing the build.
 *
 * Env overrides:
 *   OPENTRMS_BACKEND   - path to the backend repo (default: ~/ideas/opentrms)
 *   OPENTRMS_FRONTEND  - path to the frontend repo (default: ~/ideas/opentrms-workbench)
 *   OPENTRMS_OPENAPI   - path to a local OpenAPI spec file (json or yaml) to copy in
 *   TRMS_OPENAPI_URL   - URL to fetch the live spec from (default: http://localhost:8080/v3/api-docs)
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BACKEND = process.env.OPENTRMS_BACKEND || path.join(os.homedir(), 'ideas/opentrms');
const FRONTEND = process.env.OPENTRMS_FRONTEND || path.join(os.homedir(), 'ideas/opentrms-workbench');
const OPENAPI_LOCAL = process.env.OPENTRMS_OPENAPI;
const OPENAPI_URL = process.env.TRMS_OPENAPI_URL || 'http://localhost:8080/v3/api-docs';

const REPO_ROOT = path.join(import.meta.dirname, '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const STATIC_DIR = path.join(REPO_ROOT, 'static');

const TODAY = new Date().toISOString().slice(0, 10);

function warn(msg) {
  console.warn(`[sync] WARN: ${msg}`);
}

function info(msg) {
  console.log(`[sync] ${msg}`);
}

function updateMarkedRegion(filePath, begin, end, generatedRegion, label) {
  let existing;
  try {
    existing = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    warn(`Could not read ${filePath} (${err.code ?? err.message}); skipping ${label}.`);
    return;
  }

  const beginIdx = existing.indexOf(begin);
  const endIdx = existing.indexOf(end);

  if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx) {
    warn(`Markers ${begin} / ${end} not found in ${filePath}; skipping ${label}.`);
    return;
  }

  const before = existing.slice(0, beginIdx + begin.length);
  const after = existing.slice(endIdx);
  const updated = `${before}\n${generatedRegion}\n${after}`;
  fs.writeFileSync(filePath, updated, 'utf8');
  info(`${label}: updated ${filePath}`);
}

function escapeMarkdownCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .trim();
}

function findFilesBySuffix(dir, suffix) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true});
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFilesBySuffix(full, suffix));
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      results.push(full);
    }
  }
  return results;
}

function parseJavaStringExpression(expr) {
  const literals = [...String(expr).matchAll(/"((?:\\.|[^"\\])*)"/g)];
  return literals
    .map((match) => JSON.parse(`"${match[1]}"`))
    .join('');
}

/**
 * (a) ERD -> docs/reference/erd.mdx
 */
function parseErdSource(mermaidBody) {
  const lines = mermaidBody.split('\n');
  const sectionHeaderRegex = /^\s*%%\s+──\s+(.+?)\s+─+\s*$/;
  const entityStartRegex = /^\s*([a-z_][a-z0-9_]*)\s*\{\s*$/;
  const relationshipRegex = /^\s*([a-z_][a-z0-9_]*)\s+([|o}{\-]+)\s+([a-z_][a-z0-9_]*)\s*:\s*(.+?)\s*$/;

  const sections = [];
  const entityBlocks = new Map();
  const relationshipLines = [];

  let currentSection = null;
  let currentEntityName = null;
  let currentEntityLines = [];

  for (const line of lines) {
    const sectionMatch = line.match(sectionHeaderRegex);
    if (sectionMatch) {
      const title = sectionMatch[1].trim();
      currentSection = title === 'RELATIONSHIPS'
        ? null
        : {
            title,
            entities: [],
          };
      if (currentSection) {
        sections.push(currentSection);
      }
      continue;
    }

    if (currentEntityName) {
      currentEntityLines.push(line);
      if (/^\s*\}\s*$/.test(line)) {
        entityBlocks.set(currentEntityName, currentEntityLines.join('\n'));
        currentEntityName = null;
        currentEntityLines = [];
      }
      continue;
    }

    const entityMatch = line.match(entityStartRegex);
    if (entityMatch && currentSection) {
      currentEntityName = entityMatch[1];
      currentEntityLines = [line];
      currentSection.entities.push(currentEntityName);
      continue;
    }

    const relationshipMatch = line.match(relationshipRegex);
    if (relationshipMatch) {
      relationshipLines.push({
        left: relationshipMatch[1],
        right: relationshipMatch[3],
        line: line.trim(),
      });
    }
  }

  return {sections, entityBlocks, relationshipLines};
}

function buildErdSectionDiagram(section, entityBlocks, relationshipLines) {
  const internalEntities = new Set(section.entities);
  const stubEntities = new Set();
  const relevantRelationships = relationshipLines.filter((relationship) => {
    const leftInternal = internalEntities.has(relationship.left);
    const rightInternal = internalEntities.has(relationship.right);

    if (leftInternal && !rightInternal) {
      stubEntities.add(relationship.right);
    }
    if (!leftInternal && rightInternal) {
      stubEntities.add(relationship.left);
    }

    return leftInternal || rightInternal;
  });

  const lines = ['erDiagram', `    %% ${section.title}`, ''];

  for (const entityName of section.entities) {
    const block = entityBlocks.get(entityName);
    if (block) {
      lines.push(block, '');
    }
  }

  if (stubEntities.size > 0) {
    lines.push('    %% Cross-domain stubs');
    for (const entityName of [...stubEntities].sort((a, b) => a.localeCompare(b))) {
      if (internalEntities.has(entityName)) {
        continue;
      }
      lines.push(
        `    ${entityName} {`,
        '        UUID id PK',
        '    }',
        '',
      );
    }
  }

  if (relevantRelationships.length > 0) {
    lines.push('    %% Relationships');
    for (const relationship of relevantRelationships) {
      lines.push(`    ${relationship.line}`);
    }
  }

  return lines.join('\n').trimEnd();
}

function syncErd() {
  const erdSourcePath = path.join(BACKEND, 'docs', 'ERD.mermaid');
  const outPath = path.join(DOCS_DIR, 'reference', 'erd.mdx');
  const downloadPath = path.join(STATIC_DIR, 'erd', 'trms-erd-full.mermaid');

  let mermaidBody;

  try {
    mermaidBody = fs.readFileSync(erdSourcePath, 'utf8').trimEnd();
    info(`ERD: read ${erdSourcePath}`);
  } catch (err) {
    warn(`ERD source not found at ${erdSourcePath} (${err.code ?? err.message}); writing placeholder.`);
    const placeholder = `---
id: erd
title: Entity-relationship diagram
description: The OpenTRMS database schema, generated from the backend's ERD source.
---

<div className="eyebrow">Reference</div>

# Entity-relationship diagram

<StatusBadge status="stable" reviewed="${TODAY}" />

:::note
The ERD source (\`docs/ERD.mermaid\`) was not found in the backend repository. Run \`npm run sync\` after fixing \`OPENTRMS_BACKEND\`.
:::

\`\`\`mermaid
erDiagram
    PLACEHOLDER {
        TEXT note "ERD source not found - run npm run sync after fixing OPENTRMS_BACKEND"
    }
\`\`\`
`;
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(outPath, placeholder, 'utf8');
    info(`ERD: wrote placeholder ${outPath}`);
    return;
  }

  const {sections, entityBlocks, relationshipLines} = parseErdSource(mermaidBody);
  const domainSections = sections.filter((section) => section.entities.length > 0);
  const tableCount = domainSections.reduce((sum, section) => sum + section.entities.length, 0);
  const summaryRows = domainSections
    .map((section) => `| ${escapeMarkdownCell(section.title)} | ${section.entities.length} |`)
    .join('\n');
  const sliceSections = domainSections
    .map((section) => {
      const diagram = buildErdSectionDiagram(section, entityBlocks, relationshipLines);
      return `### ${section.title} (${section.entities.length} table${section.entities.length === 1 ? '' : 's'})

\`\`\`mermaid
${diagram}
\`\`\``;
    })
    .join('\n\n');

  const content = `---
id: erd
title: Entity-relationship diagram
description: The OpenTRMS database schema, generated from the backend's ERD source.
---

<div className="eyebrow">Reference</div>

# Entity-relationship diagram

<StatusBadge status="stable" reviewed="${TODAY}" />

The full OpenTRMS schema currently spans **${tableCount} tables**, so this page
splits the backend ERD into domain slices generated from \`docs/ERD.mermaid\`.
Each slice keeps the local tables readable and adds one-field stubs when a
foreign-key edge crosses into another domain.

| Domain | Tables |
| --- | ---: |
${summaryRows}

[Download the full Mermaid source](/erd/trms-erd-full.mermaid)

## Domain slices

{/* AUTO-GENERATED by scripts/sync-from-source.mjs - do not edit; run npm run sync */}

${sliceSections}

## Full diagram

<details>
  <summary>Expand the full ${tableCount}-table ERD</summary>

\`\`\`mermaid
${mermaidBody}
\`\`\`

</details>
`;

  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  fs.writeFileSync(outPath, content, 'utf8');
  fs.mkdirSync(path.dirname(downloadPath), {recursive: true});
  fs.writeFileSync(downloadPath, `${mermaidBody}\n`, 'utf8');
  info(`ERD: wrote ${outPath}`);
  info(`ERD: wrote ${downloadPath}`);
}

/**
 * (b) Schema catalog -> inject generated table into docs/reference/schema-catalog.md
 */
function findJsonFiles(dir) {
  return findFilesBySuffix(dir, '.json');
}

function syncSchemaCatalog() {
  const schemasDir = path.join(BACKEND, 'schemas');
  const catalogPath = path.join(DOCS_DIR, 'reference', 'schema-catalog.md');

  const BEGIN = '{/* BEGIN GENERATED:schemas */}';
  const END = '{/* END GENERATED:schemas */}';

  let generatedRegion;

  const files = findJsonFiles(schemasDir).sort();

  if (files.length === 0) {
    warn(`No schemas found at ${schemasDir}; writing note into schema-catalog.md.`);
    generatedRegion = `No schemas found at ${schemasDir}.`;
  } else {
    const rows = [];
    for (const file of files) {
      const rel = path.relative(schemasDir, file);
      let titleVal = rel;
      let descVal = '';
      try {
        const raw = fs.readFileSync(file, 'utf8');
        const parsed = JSON.parse(raw);
        titleVal = parsed.title || parsed.$id || rel;
        descVal = parsed.description || '';
      } catch (err) {
        warn(`Could not parse ${file} as JSON (${err.message}); using filename.`);
      }
      const escape = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
      rows.push(`| \`${escape(rel)}\` | ${escape(titleVal)} | ${escape(descVal)} |`);
    }
    generatedRegion = ['| Schema | Title | Description |', '| --- | --- | --- |', ...rows].join('\n');
    info(`Schema catalog: found ${files.length} schema file(s) under ${schemasDir}.`);
  }

  updateMarkedRegion(catalogPath, BEGIN, END, generatedRegion, 'Schema catalog');
}

function syncScopesReference() {
  const controllersDir = path.join(BACKEND, 'trms-api', 'src', 'main', 'java');
  const scopesPath = path.join(DOCS_DIR, 'reference', 'scopes.md');
  const BEGIN = '{/* BEGIN GENERATED:scopes */}';
  const END = '{/* END GENERATED:scopes */}';

  const files = findFilesBySuffix(controllersDir, '.java').sort();
  const scopeRegex = /@RequireScope\("([^"]+)"\)/g;
  const scopeCounts = new Map();
  let annotationCount = 0;

  for (const file of files) {
    let raw;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (err) {
      warn(`Could not read ${file} (${err.code ?? err.message}); skipping.`);
      continue;
    }
    for (const match of raw.matchAll(scopeRegex)) {
      annotationCount += 1;
      scopeCounts.set(match[1], (scopeCounts.get(match[1]) ?? 0) + 1);
    }
  }

  let generatedRegion;
  if (scopeCounts.size === 0) {
    warn(`No @RequireScope annotations found under ${controllersDir}; writing note into scopes reference.`);
    generatedRegion = [
      '> AUTO-GENERATED from `@RequireScope` literals in `trms-api/src/main/java`. Do not edit by hand; run `npm run sync`.',
      '',
      `No \`@RequireScope\` annotations were found under \`${controllersDir}\`.`,
    ].join('\n');
  } else {
    const scopesByResource = new Map();
    for (const scope of scopeCounts.keys()) {
      const lastColon = scope.lastIndexOf(':');
      const resource = lastColon === -1 ? scope : scope.slice(0, lastColon);
      const list = scopesByResource.get(resource) ?? [];
      list.push(scope);
      scopesByResource.set(resource, list);
    }

    const rows = [...scopesByResource.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([resource, scopes]) => {
        const sortedScopes = scopes.sort((a, b) => a.localeCompare(b));
        const scopeList = sortedScopes.map((scope) => `\`${scope}\``).join(', ');
        return `| \`${escapeMarkdownCell(resource)}\` | ${scopeList} |`;
      });

    generatedRegion = [
      '> AUTO-GENERATED from `@RequireScope` literals in `trms-api/src/main/java`. Do not edit by hand; run `npm run sync`.',
      '',
      `${scopeCounts.size} distinct scope strings are enforced via ${annotationCount} \`@RequireScope\` annotations across the REST controllers in \`trms-api\`.`,
      '',
      '| Resource | Scopes |',
      '| --- | --- |',
      ...rows,
    ].join('\n');
    info(`Scopes: found ${scopeCounts.size} distinct scope(s) across ${annotationCount} annotations.`);
  }

  updateMarkedRegion(scopesPath, BEGIN, END, generatedRegion, 'Scopes reference');
}

function extractToolMethods(raw) {
  const toolRegex = /@Tool\s*\(\s*description\s*=\s*([\s\S]*?)\)\s*public\s+\S+\s+(\w+)\s*\(([\s\S]*?)\)\s*\{/g;
  const paramRegex = /@ToolParam\s*\(\s*description\s*=\s*([\s\S]*?)\)\s*[\w<>\[\],.? ]+\s+(\w+)/g;
  const methods = [];

  for (const match of raw.matchAll(toolRegex)) {
    const [, descriptionExpr, methodName, paramsBlock] = match;
    const params = [];
    for (const paramMatch of paramsBlock.matchAll(paramRegex)) {
      const [, paramDescriptionExpr, paramName] = paramMatch;
      params.push({
        name: paramName,
        description: parseJavaStringExpression(paramDescriptionExpr),
      });
    }
    methods.push({
      name: methodName,
      description: parseJavaStringExpression(descriptionExpr),
      params,
    });
  }

  return methods;
}

function syncMcpToolsReference() {
  const toolsDir = path.join(BACKEND, 'trms-ai', 'src', 'main', 'java', 'io', 'trms', 'ai', 'tool');
  const toolsPath = path.join(DOCS_DIR, 'reference', 'mcp-tools.md');
  const BEGIN = '{/* BEGIN GENERATED:mcp-tools */}';
  const END = '{/* END GENERATED:mcp-tools */}';

  const files = findFilesBySuffix(toolsDir, '.java').sort();
  const toolClasses = [];

  for (const file of files) {
    const className = path.basename(file, '.java');
    let raw;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (err) {
      warn(`Could not read ${file} (${err.code ?? err.message}); skipping.`);
      continue;
    }

    const methods = extractToolMethods(raw);
    if (methods.length > 0) {
      toolClasses.push({className, methods});
    }
  }

  let generatedRegion;
  if (toolClasses.length === 0) {
    warn(`No @Tool methods found under ${toolsDir}; writing note into MCP tools reference.`);
    generatedRegion = [
      '> AUTO-GENERATED from `@Tool` methods in `trms-ai/src/main/java/io/trms/ai/tool`. Do not edit by hand; run `npm run sync`.',
      '',
      `No \`@Tool\` methods were found under \`${toolsDir}\`.`,
    ].join('\n');
  } else {
    const totalTools = toolClasses.reduce((sum, toolClass) => sum + toolClass.methods.length, 0);
    const sections = toolClasses.flatMap((toolClass) => {
      const rows = toolClass.methods.map((method) => {
        const params = method.params.length === 0
          ? '—'
          : method.params
              .map((param) => `\`${escapeMarkdownCell(param.name)}\` - ${escapeMarkdownCell(param.description)}`)
              .join('<br/>');
        return `| \`${escapeMarkdownCell(method.name)}\` | ${params} | ${escapeMarkdownCell(method.description)} |`;
      });

      return [
        `### ${toolClass.className} (${toolClass.methods.length} tool${toolClass.methods.length === 1 ? '' : 's'})`,
        '',
        '| Tool | Parameters | Description |',
        '| --- | --- | --- |',
        ...rows,
        '',
      ];
    });

    generatedRegion = [
      '> AUTO-GENERATED from `@Tool` methods in `trms-ai/src/main/java/io/trms/ai/tool`. Do not edit by hand; run `npm run sync`.',
      '',
      `There are **${totalTools}** \`@Tool\` methods today, across ${toolClasses.length} tool class${toolClasses.length === 1 ? '' : 'es'}.`,
      '',
      ...sections,
    ].join('\n');
    info(`MCP tools: found ${totalTools} tool method(s) across ${toolClasses.length} class(es).`);
  }

  updateMarkedRegion(toolsPath, BEGIN, END, generatedRegion, 'MCP tools reference');
}

/**
 * (c) OpenAPI spec -> static/openapi/trms-openapi.json
 *
 * Source precedence (never throws; degrades gracefully):
 *   1. OPENTRMS_OPENAPI - local file path (json or yaml), copied in as-is
 *   2. TRMS_OPENAPI_URL (or the localhost default) - fetched live
 *   3. the existing committed copy, left untouched
 */
async function syncOpenApiSpec() {
  const outPath = path.join(STATIC_DIR, 'openapi', 'trms-openapi.json');

  // 1. Local file override.
  if (OPENAPI_LOCAL) {
    try {
      const raw = fs.readFileSync(OPENAPI_LOCAL, 'utf8');
      let toWrite = raw;
      if (OPENAPI_LOCAL.endsWith('.json')) {
        toWrite = JSON.stringify(JSON.parse(raw), null, 2) + '\n';
      }
      fs.mkdirSync(path.dirname(outPath), {recursive: true});
      fs.writeFileSync(outPath, toWrite, 'utf8');
      info(`OpenAPI spec: copied from OPENTRMS_OPENAPI=${OPENAPI_LOCAL} -> ${outPath}`);
      return;
    } catch (err) {
      warn(`Could not read OPENTRMS_OPENAPI=${OPENAPI_LOCAL} (${err.code ?? err.message}); falling back to live fetch.`);
    }
  }

  // 2. Live fetch.
  try {
    const res = await fetch(OPENAPI_URL, {signal: AbortSignal.timeout(5000)});
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const spec = await res.json();
    if (!spec || typeof spec.openapi !== 'string') {
      throw new Error('response did not look like an OpenAPI document (missing "openapi" field)');
    }
    fs.mkdirSync(path.dirname(outPath), {recursive: true});
    fs.writeFileSync(outPath, JSON.stringify(spec, null, 2) + '\n', 'utf8');
    info(`OpenAPI spec: fetched from ${OPENAPI_URL} (openapi ${spec.openapi}, ${Object.keys(spec.paths ?? {}).length} paths) -> ${outPath}`);
    return;
  } catch (err) {
    warn(`Could not fetch OpenAPI spec from ${OPENAPI_URL} (${err.message}); keeping the existing committed copy at ${outPath}.`);
  }

  // 3. Keep whatever is already committed - nothing to do.
  if (!fs.existsSync(outPath)) {
    warn(`No committed OpenAPI spec found at ${outPath} either; API reference generation will have nothing to work from.`);
  }
}

async function main() {
  info(`Backend source: ${BACKEND}`);
  info(`Frontend source: ${FRONTEND}`);
  syncErd();
  syncSchemaCatalog();
  syncScopesReference();
  syncMcpToolsReference();
  await syncOpenApiSpec();
  info('Done.');
}

main();
