---
id: new-product-playbook
title: New-product playbook
description: The end-to-end checklist for onboarding a new product type.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# New-product playbook

This page documents the current backend playbook for adding a new product
today. It is based on the upstream `docs/NEW_PRODUCT_PLAYBOOK.md`, but written
for contributors who need the present implementation path, not the future
roadmap alone.

If you are looking for the larger architecture target, read
[Extensibility model](/extend/extensibility-model) after this page.

## 1. Choose the product identity

A new product needs a stable combination of:

- `productType`
- `assetClass`
- `productSubtype`

Those three fields drive schema lookup, SPI routing, and downstream reporting.
Choose them first, because everything else keys off that identity.

## 2. Define the capture schema

Add or update the JSON schema under the backend `schemas/` tree, typically at a
path like:

```text
schemas/deals/<productType>/<assetClass>/<productSubtype>.json
```

Use the existing catalog as the model:

- vanilla IRS lives at `schemas/deals/swap/rates/vanilla.json`
- repo lives at `schemas/deals/repo/money_market/vanilla.json`
- a custom example lives at
  `schemas/deals/custom/rates/acme_range_accrual.json`

Schema authoring conventions are covered in
[Authoring JSON Schemas](/extend/schema-authoring).

## 3. Decide whether the product is built-in or artifact-backed

OpenTRMS currently supports more than one extension path:

- built-in Java implementations registered as Spring beans
- Python calculator artifacts
- signed JAR calculator artifacts

The artifact-backed route is useful when you want to ship product logic without
forking core modules. The current platform resolves explicit or tenant-active
artifacts before falling back to built-in beans.

## 4. Implement the product behavior

Most products need at least pricing, and many need more:

- `ProductValuator` for market value and P&L
- `CashflowGenerator` for projected payment schedules
- `PostingRuleContributor` when accounting rules differ from the fallback model

Start with valuation. If the product cannot produce a coherent mark, the rest
of the lifecycle usually is not ready either.

## 5. Register any external artifact metadata

If you are using Python or JAR calculators, make sure the artifact metadata
matches how the backend resolves implementations. Current conventions include
fields such as:

- `product_types`
- `module_path`
- `function_name`

The backend repository also contains `schemas/product_registry.json`, which is
the current registry file shape used to map products to artifacts.

## 6. Validate the product end to end

A workable new-product definition should pass all of these checks:

1. The deal captures against its schema.
2. The platform resolves the intended valuator for that deal.
3. Repeated valuations stay deterministic.
4. Cashflows, if applicable, reconcile with the pricing model.
5. Accounting behavior is either correct by default or explicitly overridden.

Run the compatibility suite described in [Run the TCK](/extend/tck), then add
focused product tests around the new schema and model.

## 7. Reload schemas and re-test locally

Deal schemas are reloadable at runtime. After changing schema files, reload them
through:

```bash
curl -sS -X POST http://localhost:8080/api/v1/config/schemas/reload
```

That lets you iterate on capture payloads without a full application restart.

## 8. Update docs and examples

Once the product works, finish the contributor-facing work:

- add it to the [schema catalog](/reference/schema-catalog) if the catalog is
  generated from the backend changes
- add or refresh any capture examples and API docs
- document any unusual market-data assumptions or accounting overrides

Products that only exist in code are hard to support later. Close the loop while
the implementation details are still fresh.

## What is still roadmap material

The upstream playbook also describes the target state for a cleaner external
extension model. That direction is useful, but contributors working on the
current codebase should treat it as guidance, not as proof that every external
packaging workflow is already turnkey.

## Related reading

- [Authoring JSON Schemas](/extend/schema-authoring)
- [Write a ProductValuator](/extend/product-valuator)
- [Extensibility model](/extend/extensibility-model)
