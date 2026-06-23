---
id: valuation
title: Valuation
description: How the valuation engine prices deals through pluggable product valuators, and what backs the math.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Valuation

`trms-valuation` computes mark-to-market value and risk for every confirmed
deal. The engine itself is product-agnostic — it resolves a `ProductValuator`
for the deal's product type and asset class, hands it the deal's details, a
curve, and market data, and assembles the result into a `Valuation` record.
New asset classes are added by implementing the
[`ProductValuator` SPI](/extend/product-valuator), not by changing the
engine.

## Summary vs. component-level detail

A summary valuation produces one row per deal per date: market value, clean
value, accrued interest, book value, day P&L (against the prior valuation),
realized and unrealized P&L, the curve used, the model name, and risk
measures (Greeks) where the product has them. This is what most read paths
need.

Detailed valuation goes further: it asks the valuator for
`calculate_components`, which returns a list of `ValuationDetail` rows — one
per cashflow, coupon, or leg, each carrying its own present value, discount
factor, accrued amount, and (for floating legs) forward and fixing rates.
For an interest rate swap, that means a PV line for every projected cashflow
on both legs, rolled up into a leg-level summary; for a bond, a line per
coupon plus one for principal redemption. The summary and the detail are
designed to reconcile: component PVs should sum to the deal-level PV, and
the engine logs a "residual" component when they don't, rather than letting
the difference disappear silently.

## The model layer: GraalPy and QuantLib

`trms-python` hosts a GraalPy context that lets `ProductValuator`
implementations call into Python — specifically QuantLib — for pricing
models that are impractical to reimplement natively in Java: discounted
cashflow with curve bootstrapping, day-count conventions, and the kind of
date arithmetic that QuantLib already gets right. This is a bridge, not a
rewrite: the JVM owns orchestration, persistence, and the event-sourced
write path; GraalPy owns the numerical model for the duration of a single
valuation call. Keeping that boundary narrow is what lets the valuation
engine stay swappable per product without dragging a Python runtime into
unrelated request paths.

## Cashflows feed valuation, not the other way around

Cashflows are generated and tracked independently (projected → fixed →
settled, or cancelled) according to the instrument's processing group —
perpetual instruments only need settlement cashflows, sharable instruments
track coupons plus deal-level flows, unique instruments derive cashflows
from the deal's own details. Valuation consumes whatever cashflows are
currently fixed for a deal; it doesn't generate them. Conditional cashflows
carry their trigger conditions in the extension payload and are evaluated
during [end-of-day](/concepts/end-of-day), which is also when the EOD
valuation step (`POST /portfolio/valuate`) runs against the full book.

A deal amended after a valuation has already been linked to a journal entry
doesn't get that valuation silently rewritten — the journal stays linked to
the valuation that existed when it was posted, and the amendment triggers a
fresh valuation plus a reversal-and-repost in
[accounting](/concepts/accounting). The linkage, not the number, is what's
permanent.
