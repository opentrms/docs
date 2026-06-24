---
id: end-of-day
title: End-of-day
description: The fixed, reproducible pipeline that revalues the book, closes out, nets, and posts each day.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# End-of-day

End-of-day in OpenTRMS is not a single batch job with internal steps hidden
from view — it's an explicit, ordered sequence of API calls orchestrated by
`trms-batch`, each one independently idempotent. Trigger a run from
`/api/v1/batch/eod/trigger` and track it at
`/api/v1/batch/eod/status/{date}`; under the hood, the orchestrator walks
through fixings, curve construction, cashflow evaluation, portfolio
valuation, closeout, netting, margin, compliance, journal posting, and
(when applicable) period close, finishing with a system audit event marking
EOD complete for that date.

## Why the order matters

Each step depends on the output of the one before it: curves need the
day's fixings; valuation needs curves; closeout needs valuations to compute
realized P&L on a match (see [Closeout & compression](/concepts/closeout));
netting needs to know which settlements survived closeout; journal entries
need the day's valuations and closeout P&L to post against (see
[Accounting](/concepts/accounting)); period-close needs every entry posted
first. Running these out of order, or in parallel where the pipeline assumes
sequence, would mean later steps consuming stale or partial inputs — so the
orchestrator runs them as a strict sequence rather than a fan-out.

## Reproducibility

Every input EOD consumes — fixings, curves, market data, the deal book at
that point in time — is itself recorded in the
[event store](/concepts/event-store). Re-running EOD for a historical date
against the same recorded inputs reproduces the same valuations, the same
closeout matches, and the same journal entries, because nothing EOD touches
is mutable state that could have silently drifted since the original run.
This is what makes it credible to say "rerun yesterday's EOD" as an
operational answer to a discrepancy, rather than something to be feared as
non-deterministic.

## Idempotency and concurrency control

Each of the eleven steps is individually idempotent — re-running
`POST /portfolio/valuate` for a date that already has valuations doesn't
double-post them. An advisory lock prevents two EOD runs for overlapping
scope from executing concurrently, which matters because the steps are
stateful and sequential by design; a second run racing the first would
violate the ordering guarantee the whole pipeline depends on. Two supporting
scheduled jobs run independently of the EOD pipeline itself: an approval
timeout checker every 15 minutes (see
[Approval chains](/concepts/approval-chains)) and an instruction expiry
checker hourly — both keep moving even between EOD runs.

## Sign-off

The final visible state of an EOD run is its status, queryable per date,
and the system audit event that marks completion. Because every step along
the way appended its own events — fixings recorded, curves published,
valuations calculated, closeout batches matched, netting sets calculated —
sign-off isn't a single opaque "EOD: PASS" flag; it's a chain of evidence a
reviewer can walk through step by step. See the
[operate-eod guide](/guides/operate-eod) for triggering and monitoring a run
in practice.

## Related decisions

- [ADR-003: Business date and system time separation](/decisions/business-clock-time-model)
- [ADR-001: Event-sourced state](/decisions/event-sourced-state)
