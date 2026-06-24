---
id: e2e-playwright
title: Workbench Playwright coverage
description: How the workbench uses Playwright fixtures and conventions to cover both direct navigation and chat-driven operator flows.
---

<div className="eyebrow">Frontend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Workbench Playwright coverage

The workbench uses Playwright as its end-to-end gate from Phase 1 onward. The
suite is not a thin smoke test; it is the contract that every meaningful surface
works through both navigation modes the product supports.

## Core rule

A surface should be tested through:

1. the direct-nav path
2. the chat-driven `ui_action` path

That requirement exists because the workspace treats both entry paths as
first-class.

## Local commands

From `opentrms-workbench`:

```bash
pnpm test:e2e
pnpm test:e2e:ui
```

Playwright auto-starts `pnpm dev` when no local server is already running.

There is also a staging-oriented run:

```bash
pnpm test:e2e:staging
```

That path expects environment variables such as:

- `BASE_URL` or `TRMS_STAGING_BASE_URL`
- `TRMS_STAGING_TOKEN`

## Shared fixtures

The suite provides three key fixtures:

- `workbench`: page object for shell, left nav, chat, panels, and activity strip
- `login(role)`: seeds a token into `localStorage` before the SPA boots
- `backend`: programmable route stub for `/api/v1/**`

That makes the tests fast to write and explicit about which backend behavior is
being simulated.

## Accessibility coverage

The suite also wraps `@axe-core/playwright` through
`expectNoA11yViolations(...)`. Specs are expected to run at least one
representative accessibility check instead of treating a11y as a later pass.

## What the current suite already covers

The `e2e/` directory already includes broad coverage for:

- bond trade capture
- bond workbook and amendment flows
- deal list, deal detail, and deal history
- approval context
- EOD operator
- market index and calendar administration
- portfolio positions, summary, and risk
- mobile layout behavior
- agent integration and workspace layout handling

That makes the suite useful as documentation, not just regression protection.

## Example patterns

Two current examples show the intended style:

- trader golden-path tests that move from positions to capture and chat-prefill
  flows
- approval-context tests that verify action handling, inline validation, and
  success behavior

The backend fixture intentionally returns explicit `404` errors for unhandled API
calls so missing mocks are obvious.

## Conventions

- one spec per surface where practical
- cover both chat-path and direct-nav-path
- prefer role and label selectors over brittle test IDs
- keep visual snapshots focused on design-system or token pages
- do not depend on test order

## Related reading

- [Workbench feature guides](/frontend/feature-guides)
- [Workbench local setup and roles](/frontend/local-setup-and-roles)
- [Agent runtime](/concepts/agent-runtime)
