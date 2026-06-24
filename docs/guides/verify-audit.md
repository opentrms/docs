---
id: verify-audit
title: Verify the audit trail
description: Confirming a deal's event chain has not been tampered with.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Verify the audit trail

OpenTRMS exposes both the business-facing deal history and the lower-level audit
surface for aggregate events and hash-chain verification. This guide shows how
to use both.

In `local`, you can run these calls without a token. In `auth-on` or `server`,
the caller needs `audit:read` and `audit:verify`.

## 1. Choose a deal or other aggregate ID

If you have not captured a deal yet, follow [Book a trade](/guides/book-a-trade)
first and keep the returned `DEAL_ID`.

## 2. Read the deal's lifecycle history

The deal endpoint gives the event stream in deal terms:

```bash
curl -sS "http://localhost:8080/api/v1/deals/${DEAL_ID}/history" | jq .
```

Use this when you want the lifecycle as the deal API sees it.

## 3. Read the raw aggregate events

The audit endpoint exposes the lower-level aggregate event history:

```bash
curl -sS "http://localhost:8080/api/v1/audit/events/${DEAL_ID}" | jq .
```

This is the better surface when you are validating append-only event integrity
rather than just reviewing a deal workflow.

## 4. Verify the hash chain

Run the integrity check over the aggregate:

```bash
curl -sS -X POST \
  "http://localhost:8080/api/v1/audit/verify-chain/${DEAL_ID}" | jq .
```

Expected success shape:

```json
{
  "aggregateId": "...",
  "eventCount": 2,
  "valid": true
}
```

If the chain is broken, the response also reports:

- `brokenAtVersion`
- `expectedHash`
- `actualHash`

## 5. Optional: verify directly in PostgreSQL

For a database-level check, query the append-only event store table:

```sql
SELECT aggregate_id, version, event_type, hash, prev_hash, recorded_at
FROM event_store.events
WHERE aggregate_id = '<deal-uuid>'
ORDER BY version;
```

That query should line up with what `GET /api/v1/audit/events/{aggregateId}`
returns.

## 6. Trace valuation lineage when needed

For valuation investigations, use the lineage endpoint:

```bash
curl -sS "http://localhost:8080/api/v1/audit/lineage/${VALUATION_ID}" | jq .
```

That returns the recorded lineage from valuation to upstream sources such as
deals, curves, and fixings.

## Related reading

- [Hash chain](/concepts/hash-chain)
- [Event store](/concepts/event-store)
- [Get event history for an aggregate](/reference/api/get-event-history)
- [Verify hash chain integrity for an aggregate](/reference/api/verify-chain)
