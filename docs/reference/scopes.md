---
id: scopes
title: Scopes & entitlements
description: The full catalogue of OpenTRMS authorization scopes, derived from @RequireScope annotations on the REST controllers.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Scopes & entitlements

OpenTRMS authorizes every controller method with a single `@RequireScope("resource:action")`
annotation, enforced by `ScopeGuardAspect` in `trms-auth`. A request without the
required scope fails with HTTP 403. Humans and AI agents (via MCP and the CLI)
go through the same scope check — there is no separate AI permission model.

Scopes are not stored in a database table; they are system-defined strings.
`ScopeCatalog` in `trms-auth` holds the full set of known identifiers, used to
validate admin grants. The table below lists every scope that is actually
enforced by a `@RequireScope` annotation somewhere in the codebase today.

:::info
This list is hand-maintained from `grep -r "@RequireScope(" trms-api` against
the OpenTRMS backend. It is a candidate for future auto-generation from the
annotations at build time.
:::

## Enforced scopes, by resource

101 distinct scope strings are enforced via `@RequireScope` across the REST controllers in `trms-api` as of this writing.

| Resource | Scopes |
| --- | --- |
| `ai` | `ai:chat` |
| `approvals` | `approvals:approve`, `approvals:escalate`, `approvals:read`, `approvals:reject` |
| `artifacts` (plugin packages) | `artifacts:activate`, `artifacts:read`, `artifacts:review`, `artifacts:submit`, `artifacts:upload` |
| `audit` | `audit:read`, `audit:verify` |
| `bank_accounts` | `bank_accounts:read`, `bank_accounts:write` |
| `books` | `books:read`, `books:write` |
| `calendars` | `calendars:manage`, `calendars:read` |
| `cash` | `cash:read` |
| `cashflows` | `cashflows:fix` |
| `closeout` | `closeout:execute`, `closeout:read` |
| `compliance` | `compliance:read` |
| `config` | `config:admin`, `config:manage`, `config:read` |
| `credit` | `credit:read`, `credit:write` |
| `curves` | `curves:calibrate`, `curves:manage`, `curves:read` |
| `deals` | `deals:amend`, `deals:cancel`, `deals:capture`, `deals:close_repo`, `deals:pre-check`, `deals:read`, `deals:substitute_collateral`, `deals:terminate`, `deals:transition` |
| `dev` | `dev:auth` (local dev only) |
| `entitlements` | `entitlements:admin` |
| `fixings` | `fixings:capture`, `fixings:read` |
| `indexes` | `indexes:manage`, `indexes:read` |
| `instructions` | `instructions:claim`, `instructions:create`, `instructions:execute`, `instructions:read` |
| `instruments` | `instruments:create`, `instruments:deactivate`, `instruments:events`, `instruments:read`, `instruments:supersede`, `instruments:update` |
| `journals` | `journals:period_close`, `journals:post`, `journals:read`, `journals:reverse` |
| `market-data` | `market-data:publish`, `market-data:read` |
| `market-quotes` | `market-quotes:publish`, `market-quotes:read` |
| `netting` | `netting:execute`, `netting:read` |
| `parties` | `parties:internal:read`, `parties:internal:write` |
| `payments` | `payments:acknowledge`, `payments:cancel`, `payments:generate`, `payments:read`, `payments:send` |
| `plugins` | `plugins:admin` |
| `positions` | `positions:read` |
| `pretrade` | `pretrade:read` |
| `ref` (reference data) | `ref:read` |
| `reports` | `reports:admin`, `reports:read` |
| `risk` | `risk:manage`, `risk:read` |
| `settlements` | `settlements:cancel`, `settlements:instruct`, `settlements:read`, `settlements:send` |
| `simulations` | `simulations:manage`, `simulations:read`, `simulations:run` |
| `stp` | `stp:manage`, `stp:read` |
| `system` | `system:admin`, `system:batch`, `system:read` |
| `user` | `user:preferences:read`, `user:preferences:write` |
| `users` | `users:admin` |
| `valuations` | `valuations:execute`, `valuations:read` |
| `workbench` | `workbench:read`, `workbench:templates:read`, `workbench:templates:write` |

## Scope shape

| Convention | Detail |
| --- | --- |
| Format | `resource:action`, occasionally `resource:sub-resource:action` (e.g. `parties:internal:read`, `workbench:templates:write`) |
| Granularity | Per-endpoint, not per-role — a role is just a named bundle of scopes |
| Enforcement point | `ScopeGuardAspect` (AOP, wraps `@RequireScope`-annotated methods) |
| Failure mode | `InsufficientScopeException` → HTTP 403 |
| Source of truth | Code (`@RequireScope` literals) — no scopes table in the database |

## Scope catalog vs. enforced scopes

`ScopeCatalog.SCOPES` in `trms-auth` is intentionally a **superset** of the
scopes enforced above — it also reserves identifiers for capabilities that are
defined but not yet wired to a controller (or are wired but the catalog has
not been pruned), such as `approvals:decide`, `compliance:check`,
`compliance:rules`, `curves:build`, `curves:publish`, the `journal:*` series
(distinct from the enforced `journals:*` series), `margin:calculate`,
`margin:collateral`, `margin:read`, `extensions:manage`, `extensions:read`,
`portfolio:read`, `portfolio:scenarios`, `portfolio:valuate`,
`settlements:generate`, `settlements:netting`, and `valuations:detail`. The
catalog exists so that `EntitlementAdminService` can reject grants of unknown
scope strings (HTTP 400) when an admin assigns scopes to a `FUNCTIONAL` group —
treat it as the forward-looking namespace, and the table above as what is
actually checked today.

## Granting scopes

Scopes are granted to users via group membership, administered under
`/api/v1/admin/entitlements` (gated by `entitlements:admin`) and
`/api/v1/admin/users` (gated by `users:admin`). See
[Approval chains](/concepts/approval-chains) for how `requiredScope` on an
approval request determines who can approve a pending action.
