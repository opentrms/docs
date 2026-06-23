---
id: mcp-tools
title: MCP tools
description: The Spring AI @Tool-annotated MCP tool catalogue exposed by trms-ai — deal, approval, and valuation operations.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# MCP tools

`trms-ai` registers three `@Component` classes of Spring AI `@Tool`-annotated
methods (`trms-ai/src/main/java/io/trms/ai/tool/`). Each class is wrapped in a
`MethodToolCallbackProvider` bean in `AiConfig` and picked up by Spring AI's MCP
server auto-configuration, so every method below is exposed as an MCP tool to
any connected agent. See [Drive via MCP](/guides/drive-via-mcp) for how to
connect a client, and [Agent runtime](/concepts/agent-runtime) for how the
runtime wires these tools into a chat session.

:::info
This list is hand-maintained from the `@Tool`-annotated methods in
`trms-ai/src/main/java/io/trms/ai/tool/*.java`. It is a candidate for future
auto-generation from the annotations at build time.
:::

There are **9** `@Tool` methods today, across 3 tool classes.

## DealTools (4 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `captureDeal` | `productType`, `assetClass`, `currency`, `notionalStr`, `counterpartyId`, `bookId`, `detailsJson` | Previews a deal capture and returns a confirmation token — does **not** book the deal |
| `confirmCaptureDeal` | `confirmationToken` | Executes a previously previewed capture; books the deal via `DealService.capture` |
| `getDeal` | `dealId` | Retrieves a deal summary by UUID |
| `listDeals` | `productType`, `assetClass`, `status` (each nullable) | Lists up to 50 deals matching the given filters |

`captureDeal`/`confirmCaptureDeal` implement a human-in-the-loop preview/confirm
pattern: the agent must show the preview to the user and only call
`confirmCaptureDeal` after explicit confirmation. The token is held by
`ConfirmationStore` and is single-use.

## ApprovalTools (3 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `listPendingApprovals` | — | Lists all pending approval requests, including `requiredScope`, `stepOrder`, and `chainId` |
| `approveRequest` | `approvalId`, `comment` (optional) | Approves a pending request as the authenticated user |
| `rejectRequest` | `approvalId`, `comment` (required) | Rejects a pending request as the authenticated user |

Decisions run as the user currently bound to the MCP/HTTP request
(`AuthenticatedTrmsUserAccessor`) — the agent cannot approve on behalf of a
different identity, and the underlying `ApprovalService` still enforces the
approval chain's required scope. See
[Approval chains](/concepts/approval-chains).

## ValuationTools (2 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `valuateDeal` | `dealId`, `marketDataJson` | Valuates a deal with caller-supplied market data; returns market value, unrealized/realized/day P&L, currency |
| `getValuationSummary` | `dealId` | Human-readable one-line valuation summary using empty (default) market data |

## Authorization

The tool methods themselves carry no `@RequireScope` annotation — they call
into the same domain services (`DealService`, `ApprovalService`,
`EntitledValuationService`) that the REST controllers call, and those services
enforce scopes and approval chains internally for the authenticated caller.
In practice this means an MCP client is bound by exactly the same
[scopes](/reference/scopes) as the human user it is acting on behalf of; there
is no separate, looser scope set for agents.

## Conventions tools share with the REST API

Tool inputs/outputs follow the same wire conventions as the REST API — see
[Conventions](/reference/conventions) for `snake_case` JSON, `BigDecimal`
amounts (passed as numeric strings in tool parameters), and `UUID` IDs.
