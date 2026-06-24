---
id: platform-extensibility-surface
title: 'ADR-006: Extensibility surface is layered and narrow'
description: OpenTRMS exposes a constrained extensibility model so customization does not require core forks.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-006: Extensibility surface is layered and narrow

## Status

Proposed

## Context

If every client customization requires a fork of the core codebase, the
platform becomes difficult to upgrade and expensive to support. At the same
time, exposing too much internal surface as public API freezes design mistakes
too early.

OpenTRMS needs a customization model that supports product-specific logic
without turning internal engines, persistence, and workflow rules into public
extension hooks.

## Decision

The target extensibility model is layered:

1. Core platform modules
2. A versioned SPI surface
3. Client artifacts that implement the SPI

Within that model:

- built-in implementations should use the same SPI as external ones
- stable request records are marked `FROZEN`
- business interfaces such as `ProductValuator` are marked `STABLE`
- client artifacts do not call core repositories or engines directly
- artifact lifecycle is explicit: upload, review, approve, activate, retire

## Consequences

This keeps the public promise narrow. The platform can stabilize the product
logic boundary without promising that every internal service is extensible.

It also means the current user experience is intentionally incomplete in places.
Some of the architecture is already visible in the codebase, but the full
artifact lifecycle and client-facing tooling remain roadmap work rather than a
finished turnkey feature.

The practical benefit is upgradability. A narrower SPI has a better chance of
remaining compatible across releases than a broad "plugin anything" surface.

## Related reading

- [Extensibility model](/extend/extensibility-model)
- [SPI contracts](/extend/spi-contracts)
- [New-product playbook](/extend/new-product-playbook)
