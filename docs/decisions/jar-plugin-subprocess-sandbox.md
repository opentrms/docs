---
id: jar-plugin-subprocess-sandbox
title: 'ADR-005: JAR plugins run in a subprocess sandbox'
description: OpenTRMS isolates external Java plugins in child JVMs rather than loading them in-process.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-005: JAR plugins run in a subprocess sandbox

## Status

Accepted

## Context

OpenTRMS wants to support external Java-based pricing artifacts without turning
the main application JVM into an execution sandbox for arbitrary client code.

Classloader isolation is not a credible security boundary for untrusted plugin
code. It is also weak at controlling CPU abuse, memory abuse, and crash
containment.

## Decision

External JAR calculators run in a separate JVM subprocess. The main platform
communicates with that worker through a narrow request/response contract instead
of loading plugin classes directly into the primary process.

This model is the basis for stronger controls such as:

- per-worker memory limits
- timeout enforcement
- process termination on policy breach
- clearer future signature-verification workflows

## Consequences

The main cost is operational overhead, especially cold-start latency. That is a
known tradeoff, and the longer-term implementation path expects warm worker
pools rather than a brand-new JVM for every invocation.

The security and isolation benefits are materially stronger than an in-process
plugin model:

- plugin crashes do not have to crash the main platform
- kill semantics are simpler
- plugin dependencies stay outside the main classpath

This decision also reinforces the SPI boundary. Plugins are expected to see a
narrow contract, not reach into platform internals.

## Related reading

- [Extensibility model](/extend/extensibility-model)
- [Write a ProductValuator](/extend/product-valuator)
- [ADR-006: Extensibility surface is layered and narrow](/decisions/platform-extensibility-surface)
