---
id: tck
title: Run the TCK
description: Validating an SPI implementation against the technology compatibility kit.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Run the TCK

OpenTRMS currently ships its compatibility checks as a test module,
`trms-spi-tck`, inside the main backend repository. This is a real contract
suite, but it is not yet a polished standalone tool with its own external
packaging.

That distinction matters: today you run the TCK the same way maintainers run
other backend tests.

## What the current TCK covers

The existing JUnit suite exercises built-in SPI implementations against a common
set of expectations:

- valuators must be deterministic
- valuators must be null-safe
- valuators must stay inside an execution-time budget
- cashflow generators must be deterministic
- cashflow generators must be null-safe
- posting rule contributors must override fallback accounting rules correctly

The performance checks use preemptive test timeouts. If an implementation is
functionally correct but materially too slow, it still fails compatibility.

## Run it

From the backend repository root:

```bash
mvn test -pl trms-spi-tck -am
```

That builds upstream modules as needed and then executes the compatibility
tests.

## When to run it

Run the TCK whenever you change any of these surfaces:

- a `ProductValuator`
- a `CashflowGenerator`
- a `PostingRuleContributor`
- shared SPI request or response models

You should also run it before registering a new external artifact or promoting a
new product implementation into wider use.

## What it does not guarantee

Passing the TCK does not mean the product is fully production-ready. It does
not replace:

- schema validation against the real deal payload
- product-specific regression tests
- market-data sanity checks
- accounting reconciliation against expected journal behavior

Treat the TCK as the contract baseline, not the whole release gate.

## Related backend harnesses

The backend also contains focused verification helpers for plugin-style
implementations, including determinism and performance harnesses. Those are
useful when validating Python or JAR calculator packaging, but they are not a
substitute for the core `trms-spi-tck` module.

## A practical workflow

For a new product, the usual order is:

1. Capture and validate the deal schema.
2. Implement pricing and any required cashflow or accounting SPI.
3. Run the TCK.
4. Run focused tests for the new product and extension packaging.

That sequence catches contract errors early, before you start debugging runtime
registration problems.

## Related reading

- [SPI contracts](/extend/spi-contracts)
- [Write a ProductValuator](/extend/product-valuator)
- [New-product playbook](/extend/new-product-playbook)
