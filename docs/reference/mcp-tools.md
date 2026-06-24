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

## Tool catalogue

{/* BEGIN GENERATED:mcp-tools */}
> AUTO-GENERATED from `@Tool` methods in `trms-ai/src/main/java/io/trms/ai/tool`. Do not edit by hand; run `npm run sync`.

There are **9** `@Tool` methods today, across 3 tool classes.

### ApprovalTools (3 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `listPendingApprovals` | — | List all pending approval requests. Returns a JSON array of approval requests. |
| `approveRequest` | `approvalId` - The approval request UUID<br/>`comment` - Optional comment for the approval decision | Approve a pending approval request by its UUID. |
| `rejectRequest` | `approvalId` - The approval request UUID<br/>`comment` - Reason for rejection | Reject a pending approval request by its UUID. |

### DealTools (4 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `captureDeal` | `productType` - Product type: swap, spot, forward, option, repo, deposit<br/>`assetClass` - Asset class: rates, fx, credit, equity, money_market<br/>`currency` - ISO 4217 currency code, e.g. USD<br/>`notionalStr` - Notional amount as a number string, e.g. 10000000<br/>`counterpartyId` - Counterparty UUID<br/>`bookId` - Book UUID<br/>`detailsJson` - Financial details as JSON object string, or empty object &#123;&#125; | Preview a deal capture. Returns a preview summary and a confirmation token. Always show the preview to the user and ask for confirmation before calling confirmCaptureDeal. |
| `confirmCaptureDeal` | `confirmationToken` - The confirmation token returned by captureDeal | Execute a deal capture that was previously previewed. Requires a valid confirmation token. |
| `getDeal` | `dealId` - The deal UUID | Retrieve a deal by its UUID. Returns deal details as JSON. |
| `listDeals` | `productType` - Filter by product type, e.g. swap; or null<br/>`assetClass` - Filter by asset class, e.g. rates; or null<br/>`status` - Filter by deal status, e.g. draft; or null | List deals with optional filters. Pass null or empty string to omit a filter. |

### ValuationTools (2 tools)

| Tool | Parameters | Description |
| --- | --- | --- |
| `valuateDeal` | `dealId` - The deal UUID to valuate<br/>`marketDataJson` - Market data as JSON object string, e.g. &#123;"discountRate": 0.05&#125; | Valuate a deal using provided market data. Returns valuation summary as JSON. |
| `getValuationSummary` | `dealId` - The deal UUID | Get a human-readable valuation summary for a deal. Uses default (empty) market data. |

{/* END GENERATED:mcp-tools */}

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
