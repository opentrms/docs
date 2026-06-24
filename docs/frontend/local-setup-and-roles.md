---
id: local-setup-and-roles
title: Workbench local setup and roles
description: How to run the workbench locally, point it at a local backend, and test scoped navigation with local tokens.
---

<div className="eyebrow">Frontend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Workbench local setup and roles

The workbench is developed in its own repository, but it expects a running
OpenTRMS backend.

## 1. Install and start the frontend

From `opentrms-workbench`:

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

By default that starts Vite on `http://localhost:5173` and proxies `/api` to
`http://localhost:8080`.

## 2. Start the backend

From the main `opentrms` repository, a typical local loop is:

```bash
mvn -B -ntp spring-boot:run -pl trms-api -Dspring-boot.run.profiles=local
```

The workbench contributor docs also assume Playwright is installed locally:

```bash
pnpm exec playwright install --with-deps chromium
```

## 3. Optional frontend environment overrides

Useful local overrides include:

- `VITE_API_BASE_URL`
- `VITE_AI_PROVIDER`
- `VITE_AI_MODEL`

The default local AI provider is `openrouter`, which avoids depending on a
fully configured Anthropic backend setup during ordinary frontend development.

## 4. Understand how local auth works

The workbench stores its token in `localStorage` under
`trms_workbench_token`.

The important local-development behavior is:

- the SPA decodes the JWT payload client-side to derive scopes
- the frontend does not verify the signature itself
- the backend still enforces real authorization on requests

That means a locally injected unsigned token is good enough to light up nav
items and frontend flows, while backend responses remain the real permission
check.

## 5. Seed a local all-access token when needed

For local-only iteration, the workbench repo documents a browser-console flow
that builds an unsigned token payload with a large scope set and writes it into
`localStorage`.

The intent of that flow is pragmatic:

- unblock frontend development when auth wiring is not the thing under test
- make hidden nav sections visible
- let you exercise admin and operator surfaces quickly

If you use that path, remember that it only affects the frontend shell. Backend
routes that truly require scopes still need a backend environment willing to
accept the corresponding token.

## 6. Role-driven navigation

The shell hides surfaces you cannot access. Scope-gated navigation is one of the
main things to verify locally.

Examples:

- traders see trade capture, pretrade, blotters, and approval context
- operations users see settlement, netting, EOD, journals, and instruction
  flows
- admin roles reveal access-management and configuration surfaces

The Playwright suite also encodes this model through helper roles such as:

- `trader`
- `middle_office`
- `back_office`
- `admin`
- `full`

## 7. Quality gates

Before pushing frontend changes, the workbench repo expects:

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build
pnpm test:e2e
```

## Related reading

- [Workbench architecture overview](/frontend/workbench-overview)
- [Workbench Playwright coverage](/frontend/e2e-playwright)
- [Run locally](/guides/run-locally)
