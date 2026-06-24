---
id: index
title: Architecture decision records
description: Public ADRs capturing the key technical decisions behind OpenTRMS.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Architecture decision records

This section captures the architectural choices OpenTRMS is willing to make
public and stable enough to document. They are rewritten from backend decision
notes and architecture docs into concise ADRs that explain:

- the problem the platform needed to solve
- the decision that was taken
- the operational consequences of that decision
- whether the decision is already adopted or still proposed

## ADR template

Every ADR in this section follows the same structure:

1. `Status`
2. `Context`
3. `Decision`
4. `Consequences`

That keeps the pages short enough to read during implementation work, but still
explicit enough to justify the tradeoffs.

## Current ADR set

- [ADR-001: Event-sourced state](/decisions/event-sourced-state)
- [ADR-002: Tamper-evident hash chain](/decisions/tamper-evident-hash-chain)
- [ADR-003: Business date and system time separation](/decisions/business-clock-time-model)
- [ADR-004: FX spot curves by base currency](/decisions/fx-spot-curve-model)
- [ADR-005: JAR plugins run in a subprocess sandbox](/decisions/jar-plugin-subprocess-sandbox)
- [ADR-006: Extensibility surface is layered and narrow](/decisions/platform-extensibility-surface)

## Related reading

- [Architecture](/overview/architecture)
- [Event sourcing & CQRS](/concepts/event-sourcing)
- [Extensibility model](/extend/extensibility-model)
