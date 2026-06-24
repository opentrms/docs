---
id: tamper-evident-hash-chain
title: 'ADR-002: Tamper-evident hash chain'
description: OpenTRMS makes aggregate event history verifiable with a SHA-256 hash chain.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-002: Tamper-evident hash chain

## Status

Accepted

## Context

Append-only storage is necessary for auditability, but it is not sufficient on
its own. A privileged operator, restored backup, or direct database write can
still alter history outside normal application paths.

OpenTRMS therefore needs a way to verify that historical events are still the
events the platform originally recorded.

## Decision

OpenTRMS computes a per-aggregate SHA-256 hash chain over event payloads. Each
event hash is derived from:

- the previous event hash, or a fixed genesis hash for the first event
- a canonical JSON representation of the current event payload

The platform stores that hash with the event and exposes verification through
`POST /api/v1/audit/verify-chain/{aggregateId}`.

This control is layered with append-only database permissions. The event store
is not expected to rely on hashes alone.

## Consequences

Any historical payload change breaks not only the altered event but every
downstream event in the chain for that aggregate. That gives operators a clear
integrity signal after:

- restores
- incident response
- audit preparation
- suspicious data repair activity

The main implementation cost is additional hashing and verification logic, which
is a reasonable tradeoff for tamper evidence in a regulated system.

Operationally, restore and migration tooling must preserve event order and hash
values. If history is replayed or rewritten incorrectly, verification will fail
immediately instead of hiding the corruption.

## Related reading

- [Hash chain](/concepts/hash-chain)
- [Event sourcing & CQRS](/concepts/event-sourcing)
- [Verify audit integrity](/guides/verify-audit)
