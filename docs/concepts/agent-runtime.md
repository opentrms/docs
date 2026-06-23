---
id: agent-runtime
title: Agent runtime
description: How Spring AI agents and the MCP server operate inside the same scopes and audit trail as a human user.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Agent runtime

OpenTRMS doesn't run a separate orchestration stack for AI. Agents are
Spring AI `ChatClient` instances — `DealAgent`, `RiskAgent` — configured
with `@Tool`-annotated bean methods, calling the exact same domain services
the REST API and CLI call. There's no LangGraph layer, no Python agent
runtime sitting beside the JVM; an agent's "tool call" and a human's API
request both end up at the same service method, going through the same
scope check.

## The same MCP tools, exposed two ways

`trms-ai` runs a Spring AI MCP server that auto-exposes every `@Tool` bean
as an MCP tool, with the same scope enforcement applied as any other entry
point. This means the set of things an external MCP client (an editor
integration, a third-party agent) can do and the set of things OpenTRMS's
own built-in agents can do come from the same tool catalog — see
[MCP tools](/reference/mcp-tools) for the list, and
[Drive via MCP](/guides/drive-via-mcp) for using it directly. There's no
privileged internal API that only the built-in agents get access to.

## Human-in-the-loop by design

An agent's scopes are configured the same way a human user's are — see
[Scopes](/reference/scopes) — and the
[approval chain engine](/concepts/approval-chains) doesn't distinguish
between a human and an agent acting through a given scope. An agent
configured to flag price-band breaches can surface a finding and even
propose an action, but if confirming that action requires `approvals:decide`
and the agent's configuration doesn't grant it, the action creates a pending
approval request exactly as it would for an under-scoped human user. The
"human in the loop" isn't a UI convention layered on top — it's the same
scope and approval machinery applying to every actor type uniformly.

## Traceable like everything else

Every event records `client_type` in its metadata —`api`, `mcp_agent`,
`cli`, or `batch` — alongside a correlation id. An agent's actions append to
the same [event store](/concepts/event-store) as a human's, tagged so a
later audit can filter specifically for agent-originated activity, trace a
multi-step agent session by correlation id, and verify that every action an
agent took was within the scopes it was actually granted. There's no
separate "agent log" to reconcile against the main audit trail; it's one
trail, with `client_type` as a column to filter on, not a different table
to trust.

## CLI as a thin client

The CLI follows the same principle from the other direction: it's a thin
HTTP client offering instruction, approval, and closeout commands, with no
business logic of its own. Whether a deal-related action originates from a
human typing a CLI command, a human clicking through the API, or an agent
invoking an MCP tool, it converges on the same domain service, the same
validation, and the same audit record. "One core, many surfaces" (see
[Principles](/overview/principles)) is the same idea this page describes
applied specifically to how AI participates in the system.
