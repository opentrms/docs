---
id: valuation
title: Valuation
description: How OpenTRMS prices deals through pluggable ProductValuators.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="planned" reviewed="2026-06-23" />

# Valuation

`trms-valuation` prices deals through `ProductValuator` implementations
registered per product type, drawing on curves and market data to produce
mark-to-market and risk metrics. New asset classes plug in by implementing the
SPI contract rather than modifying the core engine.

:::note
This page is part of the documentation skeleton (Phase 0). Full content lands in a later phase.
:::
