---
id: principles
title: Principles
description: The design rules OpenTRMS holds itself to.
---

<div className="eyebrow">Overview</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Principles

OpenTRMS is built around a small set of non-negotiables. They explain why the
event store is append-only, why the same domain services back both the REST API
and the MCP server, and why nothing about pricing or risk is hidden.

- **Open by construction.** The logic that prices your book is the code in the
  repository — no license metering, no black box.
- **Self-hosted.** The platform runs in your VPC, against your PostgreSQL. Your
  positions never leave your infrastructure.
- **Audit-first.** Every state change appends a typed, hashed event. `UPDATE` and
  `DELETE` are revoked at the database level.
- **One core, many surfaces.** REST, MCP and embedded Java all call the same
  domain services with the same scopes and approval chains.

:::note
Reference content is being expanded. The [Quickstart](/) is the fastest way to
see these principles in action.
:::
