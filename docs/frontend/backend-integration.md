---
id: backend-integration
title: Workbench backend integration
description: How the workbench frontend talks to the OpenTRMS backend, and which API coverage gaps still exist.
---

<div className="eyebrow">Frontend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Workbench backend integration

The workbench frontend is a typed API client over the main OpenTRMS backend. It
does not maintain its own business backend.

## Request layer

Most backend access flows through `src/api/client.ts` plus per-domain wrappers
in `src/api/*.ts`.

The shared client currently handles:

- bearer token injection
- API base URL resolution through `VITE_API_BASE_URL`
- generated correlation IDs on every request
- JSON serialization and parsing
- structured error translation into typed frontend errors

That last part matters because the frontend already distinguishes cases such as:

- duplicate instrument conflicts
- valuation failures
- FX-rate-unavailable valuation failures

## Auth and token flow

`AuthProvider` stores the raw JWT in `localStorage` under
`trms_workbench_token`. The SPA only base64-decodes the payload so it can:

- identify the user
- derive scopes for UI gating
- configure the API client

Real authorization is still enforced by the backend on each request. The
frontend-side decode is for shell behavior, not trust.

## Data-fetching pattern

The dominant access pattern is:

1. typed schema or payload narrowing
2. query or mutation hook
3. panel-local loading and error handling
4. payload patching when the open panel's state changes

This is why surfaces such as `DealList`, `ApprovalContext`, and the bond
workbook can stay self-contained while still participating in the shared panel
system.

## Known API coverage gap

The workbench repo includes a gap analysis dated `2026-06-07` comparing frontend
usage in `src/api/*.ts` with backend controller mappings.

Current snapshot:

- frontend endpoints detected: `137`
- backend endpoints detected: `191`
- backend endpoints not used by frontend: `56`

Examples of backend routes not yet used by the frontend include:

- `POST /api/v1/batch/eod/trigger`
- `GET /api/v1/batch/eod/status/{date}`
- `POST /api/v1/eod/step`
- several payment and settlement action routes
- some closeout, curve calibration, and simulation management routes

The same analysis also found a few frontend paths with no matching backend
controller mapping in the inspected sources, including:

- `GET /api/v1/market-ref/fx-pairs/recent`
- several instrument event correction or reversal routes

Treat that document as a useful coverage map, not as proof that an endpoint is
safe to remove or ready to expose.

## Backend assumptions in local dev

The workbench expects a running backend API, usually at
`http://localhost:8080`. In dev mode, Vite proxies `/api` calls there from the
frontend dev server on `http://localhost:5173`.

Optional frontend environment overrides include:

- `VITE_API_BASE_URL`
- `VITE_AI_PROVIDER`
- `VITE_AI_MODEL`

## Where integration logic lives

- `src/api/` holds domain-specific request wrappers
- `src/schemas/` and payload narrowing protect surface inputs
- `src/refdata/` keeps manifest and reference-data sync behavior
- `src/systemDate/` bootstraps business-date context into the shell

That split keeps transport concerns, domain schemas, and UI concerns from
collapsing into a single catch-all client module.

## Related reading

- [Workbench local setup and roles](/frontend/local-setup-and-roles)
- [API Reference](/reference/api/trms-api)
- [Conventions: snake_case, system date, FX](/reference/conventions)
