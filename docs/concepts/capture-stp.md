---
id: capture-stp
title: Capture & STP
description: How a captured deal is validated and routed toward straight-through confirmation.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Capture & STP

Capturing a deal is the entry point into the
[deal state machine](/concepts/deal-state-machine): a `POST` to
`/api/v1/deals` lands the deal in `draft` or `pending_review`, and from there
the STP (straight-through processing) engine in `trms-workflow` decides
whether it can confirm itself or needs a human in the loop.

## Three validation layers, then a rule

Before STP ever runs, every write passes through the validation engine in
`trms-validation`: Layer 1a checks the deal against its product's JSON
Schema (the structural shape for a given instrument type), Layer 1b checks
any customer-defined extension payload against its own registered schema,
and Layer 2 runs business rules that can reference both layers together
(e.g. a rule that only applies when a particular extension flag is set).
This whole pipeline runs in single-digit milliseconds, because it has to run
on every write, not just the ones a human happens to be watching.

Only once a deal is structurally and semantically valid does STP evaluate
whether it qualifies for automatic confirmation.

## What the STP engine checks

STP matches the deal against a configured rule (by product type and other
match criteria) and evaluates a fixed sequence of checks, short-circuiting
on the first failure: notional within the rule's threshold, tenor within
threshold, counterparty credit rating at or above the rule's minimum,
compliance checks passed (if the rule requires it), and a valid settlement
instruction (SSI) on file for the counterparty and currency. A deal can also
be pulled out of STP eligibility entirely by an extension flag — a
`manual_review` marker in the deal's extension payload always forces human
review, regardless of how clean the rest of the checks look. This is the
escape hatch operations needs without it becoming a loophole STP itself can
exploit.

A deal that passes every check is confirmed immediately, with the specific
checks it passed recorded in the event's approval context — so "why did
this large deal go through without anyone looking at it" has a literal
answer in the audit trail, not just an inference from configuration. A deal
that fails any check is routed into [approval chains](/concepts/approval-chains)
instead, with the failure reason attached.

## What happens downstream of STP

Confirmation that comes from STP triggers cashflow generation, settlement
instruction creation, and the initial journal accrual together, in one
transaction — the same downstream effects a manually approved deal gets,
just without the wait. This is part of why STP eligibility rules are
configuration, not code: tightening or loosening which deals qualify for
automatic confirmation is a risk-appetite decision, and it shouldn't require
a deployment to change.

See [Deal state machine](/concepts/deal-state-machine) for the lifecycle STP
participates in, and the [book-a-trade guide](/guides/book-a-trade) for a
worked capture example.
