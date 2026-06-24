---
id: event-sourced-state
title: 'ADR-001: Event-sourced state'
description: OpenTRMS records domain changes as append-only events and derives read models from them.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-001: Event-sourced state

## Status

Accepted

## Context

A trade and risk platform needs to answer more than "what is the current
state?" It also needs to answer:

- what changed
- in what order it changed
- what the platform believed at the time it acted

A mutable row model is good at the first question and weak at the rest. It also
makes it harder to rebuild downstream projections deterministically after a bug
fix or schema change.

## Decision

OpenTRMS uses an append-only event store as the source of truth for aggregate
state. Commands validate input, append one or more domain events, and update
read-optimized projections in the same transaction. Queries read from those
projections rather than replaying the event log on every request.

In practice, that means:

- event order is authoritative
- optimistic concurrency is enforced on aggregate version
- projections are rebuildable from the recorded event stream
- write paths do not mutate domain history in place

## Consequences

This design gives the platform three important properties:

- current state is explainable as a fold over recorded facts
- read models can be dropped and rebuilt deterministically
- audit trails are first-class, not reconstructed after the fact

The tradeoff is that every state transition must be modeled explicitly as an
event. Engineers do not get a "just patch the row" escape hatch for core domain
state.

It also raises the testing bar. Strong write-path tests should assert both the
event-store result and the projection result, because the platform promises both
to stay aligned.

## Related reading

- [Event sourcing & CQRS](/concepts/event-sourcing)
- [Event store](/concepts/event-store)
- [ADR-002: Tamper-evident hash chain](/decisions/tamper-evident-hash-chain)
