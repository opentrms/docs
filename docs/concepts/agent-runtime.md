---
id: agent-runtime
title: Agent runtime
description: Human-in-the-loop agents that respect your scopes.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Agent runtime

OpenTRMS agents are human-in-the-loop by design. They surface findings — such as
trades outside a ±2σ price band — and propose actions, but every action runs
through your entitlements and approval chains. Agent activity appends to the same
audit trail as everything else, tagged with a correlation id.

:::note
Agent configuration and prompt design docs are in progress.
:::
