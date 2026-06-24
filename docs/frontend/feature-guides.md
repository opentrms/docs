---
id: feature-guides
title: Workbench feature guides
description: Operator-facing workflows for deal capture, blotter-style views, and approval handling in the TRMS Agent Workbench.
---

<div className="eyebrow">Frontend</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Workbench feature guides

This page focuses on the operator workflows already visible in the current
workbench implementation.

## Deal capture and workbook flow

The workbench supports both single-product capture forms and a richer bond
workbook flow.

### Standalone capture surfaces

The nav catalog exposes direct capture surfaces for products such as:

- bond trades
- FX spot, forwards, NDFs, and options
- IRS variants
- repos, deposits, CDS, and custom products
- batch deal capture

These surfaces are registry entries with default tile sizes, i18n namespaces,
and scope requirements, so the same catalog works for left-nav, chat, and saved
layouts.

### Bond deal workbook

`BondDealWorkbook` is the most integrated trade workflow today. It combines
multiple surfaces into one per-deal workspace with tabs for:

- pretrade
- deal detail or capture
- approval
- coupon schedule
- settlement
- valuation
- history

The important behavior is that the workbook changes mode as the deal matures:

- no `deal_id` means capture or pretrade mode
- a successful booking unlocks downstream tabs without reopening the panel
- loading an existing `deal_id` turns the first content tab into read-only deal
  detail
- users with `deals:amend` can switch the entry tab into embedded amend mode

Pretrade can also promote values into booking, so traders do not have to retype
ticket details by hand.

## Blotters, lists, and drill-through

The workbench uses report-style surfaces as the operator's read path.

### Deal list

`DealList` is the clearest example. It:

- fetches the deal list once
- applies client-side query filtering
- supports token-style search like `status:confirmed` or `ccy:cad`
- opens `deal_detail` when the user clicks a row

That makes it a blotter-like launch surface rather than just a static report.

### Portfolio views

Portfolio operators currently get separate report surfaces for:

- positions
- summary
- risk

These can also be opened through chat with prefilled payload filters, such as a
currency-specific positions view.

### Detail and history surfaces

Deal detail, deal history, journal detail, instruction detail, and similar
surfaces follow the same panel model. A report surface opens them as needed,
instead of navigating away from the current workspace.

## Approval UI

Approval handling is split between a generic action surface and a deal-scoped
history-first tab.

### `ApprovalContext`

`ApprovalContext` is the action surface for a specific approval request. Its
current flow is:

1. fetch the approval request
2. fetch the related deal snapshot when the approval belongs to a deal
3. expose approve, reject, and escalate actions based on scope
4. require a non-blank comment for reject
5. close the panel and push a result into the activity strip on success

The panel keeps 403 and 409 errors inline instead of dropping the user's
context.

### Workbook approval tab

`WorkbookApprovalTab` is more conservative. In a deal workbook it behaves as a
per-deal approval timeline first, not an action pad first:

- it lists all approvals tied to the deal
- it keeps approved and rejected rows visible for audit context
- it only drills into `ApprovalContext` when the user explicitly clicks
  `Review` on a pending row

That design keeps the workbook useful even when the deal does not currently need
an action.

## Related reading

- [Workbench architecture overview](/frontend/workbench-overview)
- [Workbench backend integration](/frontend/backend-integration)
- [Approval chains](/concepts/approval-chains)
