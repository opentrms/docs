---
id: extensibility-model
title: Extensibility model
description: How OpenTRMS isolates and loads platform extensions.
---

<div className="eyebrow">Extend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Extensibility model

OpenTRMS is moving toward a no-fork extension model: core platform behavior
stays in the main product, while product logic and client-specific models can be
added through stable interfaces and isolated artifacts.

That target is partly implemented today. This page separates the current backend
behavior from the longer-term platform direction described in the upstream
architecture notes.

## The three layers

The upstream architecture groups extensibility into three layers:

1. Core platform
2. SPI contracts
3. Client artifacts

In concrete terms:

- the core platform owns persistence, workflow, audit, security, and API
  orchestration
- `trms-spi` defines the contracts product logic plugs into
- artifacts provide product-specific implementations without rewriting the core

That layering is what lets OpenTRMS add a new product without threading custom
logic through unrelated modules.

## What exists today

Today the backend already supports a mixed model:

- built-in Java SPI implementations discovered as Spring beans
- Python calculator artifacts executed through the GraalPy integration
- signed JAR calculator artifacts executed in a child JVM subprocess

For valuation specifically, the backend resolves implementations in this order:

1. an explicit artifact name declared for the deal or product mapping
2. an active tenant artifact from the artifact registry
3. a built-in Java `ProductValuator`

That is already enough to support product-specific logic without modifying the
valuation engine itself.

## Why JAR plugins are isolated out of process

The current design choice for JAR plugins is deliberate: they do not run inside
the main JVM with a custom classloader boundary. Instead they run in a separate
worker JVM.

The upstream decision record calls out the main reason clearly: classloaders are
not a security boundary. A subprocess gives the platform a real place to apply:

- memory limits
- timeouts
- lifecycle control
- crash isolation

That makes external Java-based pricing safer to operate than an in-process
plugin model.

## Where Python fits

Python-backed calculators currently run through the GraalPy-based integration.
That keeps the platform orchestration in Java while still allowing model code to
use Python-friendly quantitative tooling.

For users of the docs, the important point is architectural, not language
political: Python is one artifact format the platform can host, not a separate
sidecar system with its own write path.

## Stability and contract discipline

The platform is only extensible if its boundaries are believable. That is why
OpenTRMS marks SPI types with stability tiers such as `FROZEN`, `STABLE`, and
`EVOLVING`.

The present strategy is:

- freeze the request payloads external code depends on
- keep the business contracts narrow
- allow packaging and runtime mechanics to mature behind those contracts

That is a more defensible path than freezing every implementation detail too
early.

## What is still evolving

Some of the extensibility story is clearly further ahead on paper than in the
shipping developer workflow. In particular, treat these areas as active design
space rather than fully turnkey public surface:

- artifact lifecycle and packaging ergonomics
- tenant-facing self-service registration flows
- broader external plugin tooling around verification and promotion

If you are contributing against the current codebase, use the live SPI modules
and test harnesses as the source of truth.

## When to use this model

The extension model is the right fit when you need to:

- add a new product family
- replace or augment pricing logic
- ship client-specific models without forking core modules

It is not the right fit for changing workflow, persistence, or audit semantics.
Those remain platform concerns.

## Related reading

- [SPI contracts](/extend/spi-contracts)
- [Write a ProductValuator](/extend/product-valuator)
- [New-product playbook](/extend/new-product-playbook)
- [Valuation](/concepts/valuation)
