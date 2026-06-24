---
id: drive-via-mcp
title: Drive OpenTRMS via MCP
description: Drive OpenTRMS from any MCP-compatible client.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Drive OpenTRMS via MCP

OpenTRMS exposes an MCP tool surface through the same Spring Boot application
that serves the REST API. The `trms-api` module depends on `trms-ai`, so when
the API is running you get both surfaces against the same domain services,
approval logic, and audit trail.

This is the right integration path when you want an agent to work through
OpenTRMS rather than around it.

## 1. Start OpenTRMS in a development-friendly mode

For first-time setup, start with the `local` profile:

```bash
cd ~/ideas/opentrms
mvn -pl trms-api spring-boot:run -Dspring.profiles.active=local
```

That gives you:

- the normal REST API at `http://localhost:8080`
- Swagger UI at `/docs`
- the MCP tool beans from `trms-ai`
- no JWT requirement for local experimentation

## 2. Point your MCP client at the running OpenTRMS server

Client-side MCP configuration varies by product, but the server-side rule is
simple: connect your MCP client to the running OpenTRMS application and verify
that tool discovery returns the OpenTRMS tools.

When discovery succeeds, you should see these tool groups:

- `DealTools`: `captureDeal`, `confirmCaptureDeal`, `getDeal`, `listDeals`
- `ApprovalTools`: `listPendingApprovals`, `approveRequest`, `rejectRequest`
- `ValuationTools`: `valuateDeal`, `getValuationSummary`

If your client cannot list those tools, it is not connected to the OpenTRMS MCP
surface yet.

## 3. Respect the preview/confirm capture flow

Deal capture is intentionally two-step for human-in-the-loop control:

1. call `captureDeal`
2. inspect the returned preview
3. only then call `confirmCaptureDeal` with the confirmation token

Example preview request payload:

```json
{
  "productType": "swap",
  "assetClass": "rates",
  "currency": "USD",
  "notionalStr": "10000000",
  "counterpartyId": "<counterparty-uuid>",
  "bookId": "<book-uuid>",
  "detailsJson": "{}"
}
```

Expected preview outcome:

- a `confirmationToken`
- a preview payload showing the capture has not executed yet

## 4. Use the rest of the MCP surface for read and approval work

Typical follow-up flows:

- `getDeal` to fetch a specific booked deal
- `listDeals` to filter by `productType`, `assetClass`, or `status`
- `listPendingApprovals` to review approval queues
- `approveRequest` or `rejectRequest` to act as the authenticated user
- `valuateDeal` or `getValuationSummary` for valuation work

## 5. Know the authorization boundary

MCP is not a privileged back door. The tools ultimately call the same services
that the REST controllers call, so the effective rules are the same:

- same scopes
- same approval chains
- same audit trail

That means an agent can only do what the bound user could do directly. See
[Scopes & entitlements](/reference/scopes) for the current scope catalogue.

## Related reading

- [MCP tools](/reference/mcp-tools)
- [Agent runtime](/concepts/agent-runtime)
- [Approval chains](/concepts/approval-chains)
- [Quickstart](/#talk-to-the-ai-deal-desk)
