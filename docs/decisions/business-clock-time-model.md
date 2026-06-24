---
id: business-clock-time-model
title: 'ADR-003: Business date and system time separation'
description: OpenTRMS keeps business date, system timestamp, and trade timestamp as distinct time concepts.
---

<div className="eyebrow">Decisions</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# ADR-003: Business date and system time separation

## Status

Accepted

## Context

Financial systems operate with more than one meaningful time dimension. OpenTRMS
needs to distinguish:

- the operator-controlled business date used for EOD and daily processing
- the wall-clock timestamp when the platform observed or wrote something
- the trade execution timestamp supplied by an upstream caller

Collapsing those into a single `now()` value breaks late booking, historical
replay, and bitemporal reasoning.

## Decision

OpenTRMS uses `BusinessClock` as the application boundary for time-sensitive
logic. The platform keeps three separate concepts:

- `business_date` from `BusinessClock.businessDate()`
- `system_timestamp()` from `BusinessClock.systemTimestamp()`
- `trade_timestamp` supplied by the caller and stored as received

Application code should not call `LocalDate.now()`, `Instant.now()`, or other
direct system clock APIs for business behavior.

## Consequences

This decision makes EOD sequencing and historical replay reproducible. It also
forces developers to be explicit about which notion of time they are using.

In practice:

- `business_date` drives workflow and daily eligibility
- `system_timestamp()` drives `recorded_at`, `booked_at`, and similar audit
  facts
- `trade_timestamp` stays distinct from both, with `trade_date` derived from it

Projection and audit tables that participate in bitemporal reads may therefore
carry both `as_of_date` and `recorded_at`, because those fields answer different
questions.

## Related reading

- [End-of-day](/concepts/end-of-day)
- [Conventions: snake_case, system date, FX](/reference/conventions)
- [BusinessClock SPI contract](/extend/spi-contracts)
