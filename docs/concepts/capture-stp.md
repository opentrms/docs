---
id: capture-stp
title: Capture & STP
description: Straight-through processing from capture to confirmation.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Capture & STP

A deal posted to `/api/v1/deals` runs straight-through processing: schema
validation, limit checks and counterparty resolution all execute in milliseconds
before the deal is confirmed. The response carries the new `dealId` and lifecycle
status. See the [Quickstart](/#book-your-first-trade) for a worked example.

:::note
Detailed STP rule configuration is being documented.
:::
