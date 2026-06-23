---
id: spi-contracts
title: SPI contracts
description: The service-provider interfaces OpenTRMS extensions implement.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="planned" reviewed="2026-06-23" />

# SPI contracts

`trms-spi` defines the extension points new products implement: `ProductValuator`
(pricing), `CashflowGenerator` (cashflow schedules), `PostingRuleContributor`
(accounting) and `BusinessClock` (system date awareness). Each contract is
discovered and wired without changes to core modules.

:::note
This page is part of the documentation skeleton (Phase 0). Full content lands in a later phase.
:::
