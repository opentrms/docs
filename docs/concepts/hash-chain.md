---
id: hash-chain
title: Hash chain
description: How OpenTRMS makes its event history tamper-evident, not just append-only.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Hash chain

Append-only storage (see [Event store](/concepts/event-store)) stops the
*application* from rewriting history. The hash chain is the layer that lets
you *prove* nothing was rewritten — by anyone, including someone with raw
database access — without trusting the database's word for it.

## How the chain is built

Each event's hash is a SHA-256 digest computed over its full payload —
domain details, schema extensions, and approval context together — combined
with the hash of the immediately preceding event for that aggregate. The
first event in a chain hashes against a fixed genesis value. The result is a
linked list of hashes: event *N*'s hash is a function of event *N*'s content
and event *N-1*'s hash, which is itself a function of everything before it.

Change a single byte in any historical event's payload — or its metadata, or
its position in the sequence — and that event's hash no longer matches what
was recorded. Worse for an attacker: every event recorded after it was
computed using the now-wrong hash as an input, so the entire downstream
chain breaks. There's no way to alter one event in isolation; you'd have to
recompute and rewrite every event after it, which `UPDATE`/`DELETE`
revocation already makes impossible at the database layer.

## Two independent defenses, one guarantee

This is deliberately layered with the append-only grant revocation described
in [Event store](/concepts/event-store):

- **Revoked `UPDATE`/`DELETE`** stops in-place tampering through the
  application or a SQL client using normal privileges.
- **The hash chain** detects tampering that bypasses the database entirely —
  a restored backup with a doctored row, a direct write via superuser
  credentials, replication drift — because the *content* no longer matches
  the *chain*, regardless of how it got there.

Either control alone is defeatable by a sufficiently privileged actor;
together they mean tampering requires both bypassing grants *and*
recomputing a chain of hashes that depend on everything that came after the
target event, which is what "tamper-evident" promises rather than merely
"tamper-resistant."

## Verification

A chain is verified by walking it from genesis (or from a known-good
checkpoint) and recomputing each hash, comparing it against the stored
value. This is exposed via `POST /audit/verify-chain` for on-demand checks —
useful after a restore, before a regulatory submission, or as a periodic
integrity job. A verification failure identifies exactly which event broke
the chain, which is the starting point for an incident investigation rather
than the end of one.

See [Event sourcing & CQRS](/concepts/event-sourcing) for why state is
derived from this log in the first place, and the
[verify-audit guide](/guides/verify-audit) for running a verification
end to end.
