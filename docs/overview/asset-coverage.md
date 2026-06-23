---
id: asset-coverage
title: Asset coverage
description: FX, rates, credit, money markets and bonds on one ledger.
---

<div className="eyebrow">Overview</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Asset coverage

OpenTRMS books FX, rates, credit, money markets and bonds against a single event
store. Each asset class plugs in through the same capture, STP and settlement
pipeline, so a 5Y USD interest-rate swap and an FX spot share one lifecycle and
one audit trail.

:::note
Per-asset schema details live under [Schemas](/reference/schema-catalog).
:::
