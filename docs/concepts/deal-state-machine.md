---
id: deal-state-machine
title: Deal state machine
description: The lifecycle states a deal moves through, from capture to closeout.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="planned" reviewed="2026-06-23" />

# Deal state machine

`trms-domain` models each deal as a finite state machine, with transitions
(capture, STP, confirmation, settlement, cancellation) emitting events into the
event store. Valid transitions are enforced centrally so every product follows
the same lifecycle rules.

:::note
This page is part of the documentation skeleton (Phase 0). Full content lands in a later phase.
:::
