---
id: event-sourcing
title: Event sourcing & CQRS
description: How OpenTRMS derives state from an append-only event log.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="planned" reviewed="2026-06-23" />

# Event sourcing & CQRS

OpenTRMS derives deal and account state by replaying the append-only event log
in `trms-event-store`, rather than mutating rows in place. Read models are
projected from that log, separating writes (commands that append events) from
reads (queries against projections).

:::note
This page is part of the documentation skeleton (Phase 0). Full content lands in a later phase.
:::
