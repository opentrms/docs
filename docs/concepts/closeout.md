---
id: closeout
title: Closeout & compression
description: How OpenTRMS matches and compresses offsetting positions, and crystallizes the resulting P&L.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Closeout & compression

`trms-closeout` finds deals that offset each other and resolves them out of
the live book — early termination of a single deal, or compression of many
offsetting deals into a smaller residual position. Either way, the engine's
job is the same: identify what nets to zero (or close to it), realize the
P&L that implies, and move the matched deals to the `closed_out` state in
the [deal state machine](/concepts/deal-state-machine).

## Matching is configured, not hardcoded

Closeout runs against a set of enabled rules, each scoped to a product type
and asset class. A rule finds eligible deals — `confirmed` or `settled`
status, matching that product/asset class — and groups them by an implicit
key (instrument id for perpetual and sharable instruments, currency for
unique ones) plus any customer-defined `required_match_fields`. Those extra
fields can reach into the extension payload (`extensions.cost_center`, for
example), which is how a firm enforces "only compress deals booked to the
same desk" without that rule being baked into the engine itself. Within each
group, the rule's match mode determines how offsetting pairs are found.

## What a match produces

A matched pair becomes a `CloseoutItem` per side, recording the original
notional, the net notional remaining after the match, and the realized P&L
crystallized by the match. If the net notional comes out to exactly zero,
both deals transition to `closed_out`; if a residual remains, that deal
stays active with its notional reduced rather than being forced to zero
artificially — partial compression is a legitimate outcome, not an edge
case to suppress. Realized P&L from every item in the batch feeds the
accounting engine's closeout journal entries (see
[Accounting](/concepts/accounting)), so a closeout run has accounting
consequences in the same transaction as its lifecycle consequences.

## Snapshots, not live state

A closeout batch matches against a snapshot of the deals it found, not
against deals as they exist at confirmation time. If a deal's version has
moved on between when the batch matched it and when the batch confirms that
match — because it was amended in the interim — that item is marked `stale`
and skipped rather than applied against data that's no longer current. This
is the same optimistic-concurrency posture used elsewhere in the system: a
race is detected and surfaced, not silently resolved in favor of whichever
write happened to land first.

## Where closeout sits in the day

Closeout runs after valuation and before netting in the
[end-of-day](/concepts/end-of-day) sequence (`POST /closeout/execute`),
deliberately — it needs a deal's mark-to-market to compute realized P&L
accurately, and its output (which deals are now closed, and which
settlements are now moot) feeds into what netting needs to consider for the
same day. Matching extension-aware rules also means closeout can be tuned
per customer without touching `trms-closeout` itself — see
[Extensibility model](/extend/extensibility-model) for how that
configuration surface works generally.
