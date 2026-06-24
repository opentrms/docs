---
id: fx-spot-curve-model
title: 'ADR-004: FX spot curves by base currency'
description: OpenTRMS stores spot FX as one curve per base currency and resolves pairs through FxRateService.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-004: FX spot curves by base currency

## Status

Accepted

## Context

FX data can be stored either as pair-named curves or as a base-currency-centric
grid. Pair-named storage creates duplication, makes inversion rules inconsistent
across callers, and encourages product code to construct curve names directly.

OpenTRMS needs a simpler and more uniform convention.

## Decision

OpenTRMS stores one spot curve per configured base currency:

- curve name: `FX_SPOT.{BASE}`
- grid point label: counter currency ISO code
- grid point value: counter per `1` base

All inversion and cross-currency triangulation happen inside `FxRateService`.
For pairs that do not directly include the system base currency, resolution is a
single hop through that base currency.

The deployment must set `system.base_currency`. Missing rates fail loudly with
`FxRateUnavailableException`.

## Consequences

This model keeps storage and lookup rules predictable:

- one canonical place stores spot FX for the deployment
- product code does not invent FX index names
- inverse rates are derived consistently instead of stored redundantly
- cross-currency conversion stays easy to reason about

The tradeoff is that the platform is opinionated about spot-rate storage and
defers more advanced FX conventions. Forward curves, bid/ask treatment, and
other richer market-data shapes remain future work.

## Related reading

- [Valuation](/concepts/valuation)
- [Conventions: snake_case, system date, FX](/reference/conventions)
- [Schema catalog](/reference/schema-catalog)
