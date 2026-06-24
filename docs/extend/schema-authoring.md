---
id: schema-authoring
title: Authoring JSON Schemas
description: Conventions for writing deal and event JSON Schemas.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Authoring JSON Schemas

OpenTRMS uses JSON Schema to validate deals, reference data, market data, and
configuration. For new products, the most important part is the deal schema
tree under `schemas/deals/`.

The current backend schemas target JSON Schema Draft 2020-12.

## Directory layout

Deal schemas follow a predictable path convention:

```text
schemas/deals/<productType>/<assetClass>/<productSubtype>.json
```

Examples from the current backend include:

- `schemas/deals/swap/rates/vanilla.json`
- `schemas/deals/repo/money_market/vanilla.json`
- `schemas/deals/custom/rates/acme_range_accrual.json`

Shared fragments live elsewhere in the same tree, for example:

- `schemas/_common/enums.json`
- `schemas/_common/leg.json`

Before adding a new schema, check whether the existing `_common` fragments
already define the reusable pieces you need.

## What belongs in the schema

Put product-specific payload rules in the schema, not in late controller
validation. A good schema should answer questions like:

- which fields are required
- which fields are numeric, string, date, or enum values
- which combinations are allowed together
- which nested objects are legal for the product

That keeps deal capture predictable and gives every downstream SPI a validated
payload shape.

## Use `$ref` and composition aggressively

The live swap schema is a good example. The vanilla IRS definition reuses common
leg structure and then tightens it with product-specific rules. In practice,
that means:

- referencing shared definitions with `$ref`
- using `allOf` to layer constraints
- encoding structural rules in the schema instead of in manual parsing code

This is better than duplicating large JSON blocks across products, because it
lets multiple schemas inherit the same core conventions.

## Naming and product alignment

Keep the schema path aligned with the `Deal` identity fields:

- path segment 1 matches `productType`
- path segment 2 matches `assetClass`
- filename matches `productSubtype`

If those names drift apart, schema resolution and documentation become
needlessly hard to reason about.

## Custom products are valid first-class schemas

The current backend already contains a custom example:

```text
schemas/deals/custom/rates/acme_range_accrual.json
```

Use that pattern when the product does not fit an existing standard family. The
important part is not whether the product is "standard" or "custom"; it is that
the deal shape is explicit and validated.

## Reload schemas without restarting

After changing schemas locally, reload them at runtime:

```bash
curl -sS -X POST http://localhost:8080/api/v1/config/schemas/reload
```

The current API does not require a meaningful request body for that reload call.

That reload loop is the fastest way to test capture payload changes while you
are iterating on a new product.

## Practical authoring rules

- Reuse `_common` fragments before inventing new copies.
- Prefer explicit enums and format constraints over free-form strings.
- Keep field names stable once clients start relying on them.
- Model business rules declaratively where JSON Schema can express them.
- Add examples or templates when the payload would otherwise be hard to author
  correctly.

## Related reading

- [Schema catalog](/reference/schema-catalog)
- [New-product playbook](/extend/new-product-playbook)
- [SPI contracts](/extend/spi-contracts)
