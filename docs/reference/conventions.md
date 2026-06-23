---
id: conventions
title: 'Conventions: snake_case, system date, FX'
description: Cross-cutting wire and data conventions used throughout the OpenTRMS API, CLI, and MCP tools — JSON casing, money types, dates, and FX quoting.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Conventions: snake_case, system date, FX

## JSON casing

| Rule | Detail |
| --- | --- |
| Wire format | Jackson is globally configured with `PropertyNamingStrategies.SNAKE_CASE` |
| Affects | All DTO/record fields, both request and response bodies — `targetStatus` becomes `target_status`, `indexName` becomes `index_name` |
| Does **not** affect | Raw `Map<String, Object>` keys — Jackson's naming strategy only renames declared fields, never map keys |

:::warning
If you build a request body as a raw `Map` (common in scripts, tests, and the
`trms` CLI's `--details` flag), you must supply `snake_case` keys yourself.
`Map.of("targetStatus", "confirmed")` silently sends a body where the API sees
no `target_status` field, fails validation, and returns 400 — there is no
error pointing at the casing mismatch.
:::

## Money and decimals

| Type | Rule |
| --- | --- |
| Amounts (notional, P&L, market value, FX rates) | `BigDecimal` everywhere — never `double`/`float` |
| Wire representation | Numeric JSON value (not a string), e.g. `"notional": 10000000` |
| CLI shorthand | The `trms` CLI accepts suffixes `K`/`M`/`B` for notional (e.g. `10M`, `1.5B`, `500K`) and expands them to `BigDecimal` before sending |

## Identifiers

| Type | Rule |
| --- | --- |
| Entity IDs (deals, books, counterparties, approvals, ...) | `UUID`, serialized as a string |
| Optionality | Public APIs return `Optional<T>` internally and `null`/absent fields on the wire — never throw for "not found" inside a service method |

## System date and time

OpenTRMS distinguishes three time concepts that must not be collapsed (see the
backend's `SystemDate_Convention.md`):

| Concept | Source | Use for |
| --- | --- | --- |
| `business_date` | `domain.system_params.business_date`, read via `BusinessClock.businessDate()` | EOD sequencing, daily eligibility, date-bucketed projections |
| `system_timestamp()` | `BusinessClock.systemTimestamp()` — non-overrideable wall clock | `recorded_at`, `booked_at`, and other facts about *when TRMS observed or wrote* something |
| `trade_timestamp` | Caller-supplied execution time on deal capture | Stored as received; `trade_date` is derived from it in UTC and never overwritten on late booking |

Rules:

- Application code never calls `LocalDate.now()`, `Instant.now()`, or
  `Clock.system*()` directly — always go through `BusinessClock`.
- Bitemporal projection/audit tables carry both `as_of_date` (business-effective
  date for the row version) and `recorded_at` (when TRMS wrote that version).
- EOD events use the EOD business date as `as_of_date`, not wall-clock
  `CURRENT_DATE`. See [End of day](/concepts/end-of-day).

## FX quoting

OpenTRMS stores one spot curve **per base currency**, not per pair:

| Rule | Detail |
| --- | --- |
| Curve naming | `FX_SPOT.{BASE}` — e.g. `FX_SPOT.USD` |
| Grid point label | A counter-currency ISO code (e.g. `EUR`, `BRL`, `JPY`) |
| Grid point value | *Counter per 1 base* — `FX_SPOT.USD / EUR = 0.92` means `1 USD = 0.92 EUR` |
| Invalid | Pair-named curves such as `FX_EURUSD` or `FX_USDEUR` |
| Resolution | All inversion and cross-currency triangulation happens inside `FxRateService`; a non-base-to-non-base conversion is a single hop through the system base currency, e.g. `EUR -> JPY = (EUR -> USD) * (USD -> JPY)` |
| Base currency | `system.base_currency` is mandatory runtime configuration (a deployment choice, not a code default); demo/local config sets it to `USD` |
| Missing data | `FxRateService` fails loud with `FxRateUnavailableException` — no silent `1.0` fallback, no reverse-pair-name fallback, no last-good fallback |
| Reporting base | Per-legal-entity reporting base is sourced from `parties.base_currency` when a caller supplies that context |

Valuators and accounting code never construct FX curve names directly — they
go through `FxRateService`. Forward-curve conventions and bid/ask handling are
intentionally out of scope for the current FX model.

## Related

- [Scopes & entitlements](/reference/scopes) — the authorization model these
  conventions sit alongside
- [Data dictionary](/reference/data-dictionary) — where `business_date`,
  `as_of_date`, and `recorded_at` appear as actual columns
- [End of day](/concepts/end-of-day) — the main consumer of `business_date`
  sequencing
