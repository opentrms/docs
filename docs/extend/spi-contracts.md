---
id: spi-contracts
title: SPI contracts
description: The service-provider interfaces OpenTRMS extensions implement.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# SPI contracts

`trms-spi` is the boundary between the stable OpenTRMS platform and
product-specific logic. If you need to add pricing, cashflow generation, or
accounting behavior for a new product, this is the surface you implement.

The important constraint is that OpenTRMS treats SPI code as deterministic,
side-effect-free business logic. The platform owns persistence, workflow,
authorization, and audit; your extension owns the product math and rule logic.

## Stability tiers

OpenTRMS annotates SPI types with a stability level:

- `FROZEN`: payload shape is intended to be stable for external implementers.
- `STABLE`: interface is supported and expected to evolve slowly.
- `EVOLVING`: usable, but still subject to design changes.

The most important extension inputs are already on the stable side of that
line:

- `Deal` is `FROZEN`.
- `ValuationRequest` is `FROZEN`.
- `ProductValuator` is `STABLE`.
- `CashflowGenerator` is `STABLE`.
- `PostingRuleContributor` is `STABLE`.

Treat `FROZEN` request objects as the long-lived contract your implementation
should code against.

## Core extension points

| Contract | Purpose | Main methods | When it runs |
| --- | --- | --- | --- |
| `ProductValuator` | Price a deal and return a `Valuation`. | `supports(Deal)`, `valuate(ValuationRequest)` | During valuation reads and EOD valuation runs |
| `CashflowGenerator` | Produce projected cashflows for a deal. | `supports(Deal)`, `generate(Deal)` | When the platform needs a deal cashflow schedule |
| `PostingRuleContributor` | Supply accounting rules for a journal trigger. | `supports(JournalTrigger)`, `contribute(JournalContext)` | When accounting resolves posting rules |
| `BusinessClock` | Abstract business date and timestamp lookup. | `businessDate()`, `systemTimestamp()` | Anywhere business-time awareness is needed |

These contracts are intentionally narrow. If you find yourself wanting
repository access, HTTP calls, or direct event-store writes inside an SPI
implementation, you are probably pushing logic into the wrong layer.

## Input models you should know

### `Deal`

`Deal` is the canonical product payload an extension sees. It includes core
identity and lifecycle fields such as:

- `id`, `version`, `status`
- `productType`, `productSubtype`, `assetClass`
- `counterpartyId`, `bookId`, `instrumentId`, `instrumentGroup`
- `notional`, `currency`, `effectiveDate`
- `details` and `extensions`

`details` is where the schema-driven product shape lives. That schema is defined
under the backend `schemas/` tree and documented in the
[schema catalog](/reference/schema-catalog).

### `ValuationRequest`

`ValuationRequest` wraps the pieces a valuator needs to produce a number:

- `deal`
- `marketView`
- `valuationDate`
- `priorValuation`

`priorValuation` is optional. Use it when day-over-day calculations or
explainability require a previous mark, but do not assume it is always present.

## Contract expectations

Across the SPI surface, OpenTRMS expects implementations to follow a few rules:

- Be deterministic: the same input should produce the same output.
- Be null-safe: reject invalid input explicitly instead of relying on incidental
  `NullPointerException`s.
- Stay fast: compatibility tests enforce execution budgets.
- Keep side effects out of band: SPI code should not mutate platform state on
  its own.

Those expectations are enforced partly by the current
[TCK workflow](/extend/tck) and partly by focused plugin harnesses in the
backend repository.

## Choosing the right SPI

Use the smallest contract that solves your problem:

- Use `ProductValuator` when you need market value, accrual, P&L, or risk.
- Use `CashflowGenerator` when you need a projected payment schedule.
- Use `PostingRuleContributor` when a product needs accounting rules that
  differ from the fallback rules.
- Use `BusinessClock` only when business-date indirection is required.

Do not overload a valuator to synthesize accounting or workflow decisions. The
platform composes these concerns later in the processing chain.

## Related reading

- [Write a ProductValuator](/extend/product-valuator)
- [Run the TCK](/extend/tck)
- [Valuation](/concepts/valuation)
- [Schema catalog](/reference/schema-catalog)
