---
id: hash-chain
title: Hash chain
description: Tamper-evident, replayable event history.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Hash chain

Each event carries the hash of the previous event, forming a chain per deal.
Rewriting any event would break every hash after it, so tampering is detectable.
Verify a chain end to end with `verify_hash_chain(dealId)` or via
`/api/v1/audit/verify`.

```sql
SELECT verify_hash_chain(4521);   -- ok (3 events)
```

:::note
The verification protocol is being documented in full.
:::
