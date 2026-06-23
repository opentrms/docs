---
id: drive-via-mcp
title: Drive OpenTRMS via MCP
description: Drive OpenTRMS from any MCP-compatible client.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Drive OpenTRMS via MCP

`trms-ai` exposes the platform as an MCP server using Spring AI `@Tool`
definitions for deals, approvals and valuation. Any MCP-compatible client talks to
it out of the box, calling the same domain services as the REST API — same scopes,
same approval chains, same audit trail. See the
[Quickstart](/#talk-to-the-ai-deal-desk) for client configuration.

:::note
The full tool catalogue is being documented.
:::
