---
id: event-store
title: Event store
description: The append-only PostgreSQL log every projection and audit trail derives from.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Event store

`trms-event-store` is the implementation behind [event sourcing](/concepts/event-sourcing):
an append-only table in PostgreSQL holding every event ever recorded, plus the
projectors that fold those events into queryable state.

## What an event looks like

Every event carries an aggregate type and id, an event type, a monotonic
version number, a JSON payload (domain details plus any schema extensions),
and metadata: the acting user, their roles, the scopes resolved for the
request, the client type (`api`, `mcp_agent`, `cli`, or `batch`), a
correlation id, the endpoint invoked, an idempotency key, and — where
relevant — the instruction that originated the deal and the approval context
that authorized it. Two timestamps are tracked: `valid_time` (when the event
is true of the business) and `recorded_at` (when it was written), supporting
bitemporal queries without bolting reconstruction logic onto the read side.

## Append-only by construction

`UPDATE` and `DELETE` are revoked at the database level for the events table.
This isn't an application-layer convention that a careless migration could
violate — it's enforced by PostgreSQL grants, so even a compromised
application credential cannot rewrite history. The only way to "undo"
something is to append a compensating event (`deal_rejected`,
`journal_reversed`, `payment_cancelled`), which is itself permanent.

## Projectors

Each aggregate has a corresponding projector — `DealProjector`,
`ValuationProjector`, `SettlementProjector`, `PaymentProjector`,
`JournalProjector`, `InstructionProjector`, `CloseoutProjector`,
`NettingProjector` — that consumes new events and updates a denormalized
table shaped for fast reads (e.g. current deal status, with instruction
linkage; journal entries, with valuation and reversal linkage). Projection
updates happen synchronously, in the same transaction as the event append,
so there's no read-after-write lag to reason about.

## Replay

Because projections are pure functions of the event log, they're disposable.
Rebuilding a projection table from scratch and replaying every event for an
aggregate produces the same result as the original incremental updates —
this is what makes schema evolution and bug-fixed projector logic safe to
roll out without a one-off backfill script per release.

## Idempotency

Writes carry an `Idempotency-Key` header honored for 24 hours, so retried
requests (a flaky network, an agent retrying a tool call) append at most one
event rather than double-booking a trade. Optimistic concurrency on
`(aggregate_id, version)` catches the case where two writers raced against
the same aggregate; the loser gets a 409 and re-reads before retrying.

Two PostgreSQL-specific tables back the store (see
[Schema catalog](/reference/schema-catalog) and the [ERD](/reference/erd)):
the events table itself, partitioned yearly, and a sequence/index structure
that keeps per-aggregate reads fast even as the log grows. For the
tamper-evidence layer on top of this storage, see
[Hash chain](/concepts/hash-chain).
