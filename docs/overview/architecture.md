---
id: architecture
title: Architecture
description: How the OpenTRMS modules fit together.
---

<div className="eyebrow">Overview</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Architecture

OpenTRMS is a modular Spring application. Each Maven module owns one slice of the
trade lifecycle and depends only on the contracts it needs.

| Module | Responsibility |
| --- | --- |
| **trms-api** | REST surface, Swagger UI, request validation |
| **trms-domain** | Deal model, lifecycle state machine |
| **trms-event-store** | Append-only, hash-chained event log |
| **trms-settlement** | Netting, settlement instructions |
| **trms-closeout** | End-of-day cut-off, curves, accruals |
| **trms-credit** | Counterparty lines and exposure |
| **trms-auth** | Scopes, entitlements, approval chains |
| **trms-ai** | Spring AI ChatClient agents and the MCP server |

:::note
A deeper architecture walkthrough is in progress.
:::
