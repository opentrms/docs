---
id: settlement-netting
title: Settlement & netting
description: Net exposures and generate settlement instructions.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Settlement & netting

The `trms-settlement` module nets confirmed deals by counterparty and currency,
then generates settlement instructions. Every step appends events to the same
audit trail used by capture and end-of-day.

:::note
Settlement instruction formats are being documented.
:::
