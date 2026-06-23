# OpenTRMS documentation

The documentation site for [OpenTRMS](https://github.com/ichagas/OpenTRMS),
built with [Docusaurus](https://docusaurus.io/). Dark theme, IBM Plex type, single
emerald accent — imported from the Claude Design "OpenTRMS documentation site"
project.

## Develop

```bash
npm install
npm run start        # dev server at http://localhost:3000
```

## Build

```bash
npm run build        # static output in ./build
npm run serve        # preview the production build
```

## Structure

- `docs/overview/` — Quickstart (site root), Principles, Architecture, Asset coverage
- `docs/lifecycle/` — Capture & STP, Approval chains, Settlement & netting, End-of-day
- `docs/audit-ai/` — Event store, Hash chain, MCP server, Agent runtime
- `docs/reference/` — API Reference, Schemas, Cookbook
- `src/css/custom.css` — theme tokens (colors, fonts, components)
- `src/components/Cards.tsx` — the "Next steps" card grid
- `sidebars.ts`, `docusaurus.config.ts` — navigation and site config

The Quickstart page (`docs/overview/quickstart.mdx`) is served at `/` and is the
faithful implementation of the imported `Quickstart.dc.html` design.
