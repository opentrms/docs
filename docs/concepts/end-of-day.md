---
id: end-of-day
title: End-of-day
description: Reproducible cut-off, curves, accruals and sign-off.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# End-of-day

The `trms-closeout` batch runs a reproducible end-of-day: a fixed cut-off, curve
construction, accruals and sign-off. Trigger it from
`/api/v1/batch/eod/trigger` and check progress at `/api/v1/batch/eod/status/{date}`.
Because inputs are versioned in the event store, a run can be replayed exactly.

:::note
Curve and accrual configuration docs are in progress.
:::
