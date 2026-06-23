---
id: event-store
title: Event store
description: The append-only log behind every state change.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Event store

Every lifecycle transition appends a typed event to `trms_events` in PostgreSQL.
The table is append-only: `UPDATE` and `DELETE` are revoked at the database level,
so history cannot be rewritten. Read a deal's events back from
`/api/v1/deals/{id}/events` or query the table directly.

:::note
Event type catalogue is being documented.
:::
