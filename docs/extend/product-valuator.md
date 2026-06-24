---
id: product-valuator
title: Write a ProductValuator
description: Implementing the ProductValuator SPI for a new product.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Write a ProductValuator

A `ProductValuator` is the unit of product-specific pricing in OpenTRMS. The
valuation engine stays generic; it resolves a valuator for the current deal,
passes in a frozen request model, and stores the returned `Valuation`.

This guide covers the implementation shape that exists today in the backend.
For the broader engine model, see [Valuation](/concepts/valuation).

## 1. Start from the deal schema

Before writing code, confirm the product payload you are pricing:

1. Find the deal schema in the [schema catalog](/reference/schema-catalog).
2. Verify which fields live in the core `Deal` record versus `deal.details`.
3. Decide which market data the valuator expects to find in `marketView`.

The valuator contract is stable, but the product math is only as good as the
schema and market-data assumptions behind it.

## 2. Implement the SPI

The Java contract is intentionally small:

```java
public interface ProductValuator {
    boolean supports(Deal deal);
    Valuation valuate(ValuationRequest request);
}
```

In practice:

- `supports(Deal)` should be a cheap predicate over product type, subtype, or
  asset class.
- `valuate(ValuationRequest)` should do the actual pricing and return a complete
  `Valuation`.

A minimal implementation usually looks like this:

```java
@Component
final class AcmeRangeAccrualValuator implements ProductValuator {
    @Override
    public boolean supports(Deal deal) {
        return "custom".equalsIgnoreCase(deal.productType())
            && "rates".equalsIgnoreCase(deal.assetClass())
            && "acme_range_accrual".equalsIgnoreCase(deal.productSubtype());
    }

    @Override
    public Valuation valuate(ValuationRequest request) {
        Deal deal = request.deal();
        LocalDate valuationDate = request.valuationDate();
        MarketView marketView = request.marketView();

        // Read validated product fields from deal.details(), price the trade,
        // then build a deterministic Valuation result.
        return buildValuation(deal, valuationDate, marketView);
    }
}
```

## 3. Code to the request contract, not controller payloads

`ValuationRequest` already gives you the platform-normalized inputs:

- `deal`
- `marketView`
- `valuationDate`
- `priorValuation`

That matters for two reasons:

- The same valuator can run in interactive reads and batch EOD flows.
- You do not need to know which API endpoint or workflow path triggered the
  valuation.

If you need additional product fields, add them to the deal schema and the
validated deal payload, not to ad hoc controller plumbing.

## 4. Keep results deterministic

The current compatibility tests check determinism and execution time. A good
valuator therefore:

- avoids hidden wall-clock dependencies
- avoids mutable global state
- handles missing optional fields explicitly
- returns the same output for the same request

If your model calls Python or another external runtime, keep the boundary
purely functional. Feed it request data, read back the result, and keep the
platform-facing contract unchanged.

## 5. Understand how valuators are resolved

Today the backend resolves product valuators in this order:

1. An explicit artifact name declared on the deal or product registry entry.
2. An active tenant artifact from the artifact registry.
3. A built-in Spring `ProductValuator` bean.

That means there are two common implementation modes:

- Built-in Java valuator: add a Spring-managed implementation in the backend.
- External artifact-backed valuator: publish a Python or JAR calculator and let
  the artifact registry route requests to it.

For artifact-backed implementations, the current metadata conventions include:

- `product_types`
- `module_path`
- `function_name` for Python calculators, defaulting to `valuate`

Python calculators currently run in the GraalPy-based sandbox. Signed JAR
calculators run in a child JVM subprocess, not in-process.

## 6. Verify it against the engine

At minimum, validate three things:

1. The deal captures successfully against its schema.
2. The new valuator resolves for that deal shape.
3. The returned `Valuation` is stable across repeated runs.

The current backend also includes a dedicated compatibility suite; see
[Run the TCK](/extend/tck).

## 7. Decide when you also need other SPIs

Valuation is only one part of product onboarding. Many products also need:

- a `CashflowGenerator` so projected and settled flows reconcile with pricing
- a `PostingRuleContributor` if accounting cannot rely on fallback rules

If you are adding a product from scratch, use the
[new-product playbook](/extend/new-product-playbook) rather than treating the
valuator as the whole integration.

## Related reading

- [SPI contracts](/extend/spi-contracts)
- [New-product playbook](/extend/new-product-playbook)
- [Valuation](/concepts/valuation)
