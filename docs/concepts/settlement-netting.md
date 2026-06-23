---
id: settlement-netting
title: Settlement & netting
description: How settlement instructions are generated, paid, and netted by counterparty and currency.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Settlement & netting

`trms-settlement` covers three related but distinct jobs: turning unsettled
cashflows into settlement instructions, turning settlement instructions into
outbound payment messages, and netting settlements by counterparty and
currency so fewer, larger payments move instead of many small ones. All
three append events to the same audit trail as everything else — there is
no settlement-specific exception to the event-sourced model described in
[Event sourcing & CQRS](/concepts/event-sourcing).

## From cashflow to settlement instruction

For each unsettled cashflow on a confirmed deal, the settlement engine looks
up the counterparty's standing settlement instruction (SSI) for that
currency and creates a `Settlement` record: payment date, amount, currency,
pay/receive direction (derived from the cashflow's sign), and the SWIFT
message type the cashflow implies. A settlement starts in `projected`
status. If no SSI exists for that counterparty/currency pair, the settlement
is still created — but without an SSI reference, and it stays `projected`
until operations adds one. Settlement generation never blocks deal
confirmation; missing static data becomes an operational queue item, not a
trading blocker.

## Payment messages and their lifecycle

Sending a settlement produces a `PaymentMessage`: a message type (MT103,
pacs.008, etc.), a format (SWIFT FIN, SWIFT MX, RTGS, ACH, or an internal
format) selected based on the settlement and the counterparty's SSI, and the
generated message content itself. A message moves `generated → sent →
acknowledged` on success, or to `rejected` if the receiving bank bounces it
— rejection doesn't fail the settlement, it leaves it `instructed` for
operations to investigate, and a new payment message can be generated and
sent as a retry, each with its own independent lifecycle linked to the same
settlement. Cancelling a settlement that already has a sent payment
generates a cancellation message (MT192 or camt.056) rather than silently
dropping the original.

## Netting

Settlement and payment generation deal with one deal's cashflows at a time.
Netting works across deals: for a given date, settlements still in
`projected` status are grouped by `(counterparty, currency)`, and within
each group the gross payable and gross receivable are summed into one net
amount and direction. The resulting `NettingSet` links back to every
settlement that fed it, so the net figure is always traceable to its
constituent gross flows — netting compresses what moves, not what's
recorded. This is the same step that runs during
[end-of-day](/concepts/end-of-day) (`POST /settlements/netting`), after
valuation and closeout have run for the day.

Settlement and payment data model details — table names, SSI structure,
message type enumerations — are in the
[schema catalog](/reference/schema-catalog) and [ERD](/reference/erd).
