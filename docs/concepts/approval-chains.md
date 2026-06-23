---
id: approval-chains
title: Approval chains
description: Scoped, sequential, multi-step approvals for trades that fail straight-through processing.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Approval chains

A deal that fails [STP](/concepts/capture-stp) — or that matches a condition
your firm has decided always needs a second look — doesn't get rejected. It
gets routed through an approval chain: an ordered sequence of steps, each
requiring a specific scope, evaluated by the approval chain engine in
`trms-workflow`.

## How a chain is evaluated

Chains are configured per entity type. Each chain has steps, and each step
has a condition — `notional_above` a threshold, `counterparty_rating_below`
a floor, `compliance_failure` of a given check type, a matching
`product_subtype`, or an arbitrary `extension_field` equality check against
the deal's extension payload. When a deal is evaluated, every chain whose
entity type matches is checked, and every step whose condition matches the
deal is triggered. Triggered steps are then ordered globally by chain and
step order — a deal can trigger steps from more than one chain at once, and
they all queue up in a single deterministic sequence.

## Self-approval and sequencing

If the acting user already holds the scope a triggered step requires, and
that step's quorum is 1, the step passes silently — the system doesn't make
someone approve their own action when they already had standalone authority
to take it. Otherwise the step becomes a pending `ApprovalRequest`. Only the
first step in a chain is active at creation; every step after it is
`blocked` until the one before it resolves. Approving a step looks for the
next blocked step in that chain and activates it; when there are no more
blocked steps in *any* chain triggered for that entity, the deal is
confirmed automatically. Rejecting a step at any point rejects the deal
outright and cancels every remaining pending or blocked step — there's no
partial approval state for a deal.

## Timeout and escalation

Each step carries its own timeout. A scheduled job runs every 15 minutes,
finds pending steps past their expiry, and escalates them to the
step's configured escalation scope — e.g. an unapproved limit breach
eventually reaches someone with broader authority rather than blocking the
deal indefinitely. Escalation is a configuration concern, not a code change:
who a step escalates to, and after how long, lives in the chain definition.

## Same rules for humans and agents

Both human users and AI agents act through the same scope-resolution path
(see [Agent runtime](/concepts/agent-runtime)). An agent that flags a deal
for review can hold exactly the scopes its operator configured for it — it
can surface a breach to the Head of Rates, but it cannot self-approve past a
step it doesn't hold the scope for, because the approval chain engine has no
separate code path for non-human actors. The chain doesn't know or care
whether `EventMetadata.client_type` says `api`, `mcp_agent`, `cli`, or
`batch` when deciding whether a scope check passes.

Approval activity is captured the same way every other lifecycle event is —
see [Event store](/concepts/event-store) — including which checks passed,
which chain and step triggered, and the entity snapshot the decision was
made against, so a later audit can reconstruct exactly what the approver
saw.
