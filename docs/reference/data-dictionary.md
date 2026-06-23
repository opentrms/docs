---
id: data-dictionary
title: Data dictionary
description: A curated overview of the core OpenTRMS entity groups and what each table is for — see the ERD and schema catalog for full field-level detail.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Data dictionary

This page is a curated map of the core entity groups in the OpenTRMS schema —
enough to know which table to look for, not a column-by-column reprint of the
internal spec. For full DDL and field-level detail, see the [ERD](/reference/erd)
and the per-product [Schema catalog](/reference/schema-catalog). The source for
this overview is the backend's `docs/DataDictionary_v1.0.md` and `docs/ERD.mermaid`.

## `auth` — identity and entitlements

| Table | Purpose |
| --- | --- |
| `auth.users` | Application users |
| `auth.groups` | Named bundles of scopes (`FUNCTIONAL` groups) — see [Scopes & entitlements](/reference/scopes) |
| `auth.group_members` | User-to-group membership |
| `auth.data_entitlements` | Row/data-level entitlement grants beyond plain scope checks |

## `event_store` — the audit-first core

| Table | Purpose |
| --- | --- |
| `event_store.events` | The immutable, append-only event log — single source of truth; all domain state is derived from replaying these events. `UPDATE`/`DELETE` are revoked at the database role level |
| `event_store.idempotency` | Idempotency keys so repeated event submissions don't double-apply |

See [Event sourcing](/concepts/event-sourcing), [Event store](/concepts/event-store),
and [Hash chain](/concepts/hash-chain) for how this schema is used.

## Reference data

| Table | Purpose |
| --- | --- |
| `domain.instruments` | Sharable tradable instruments (bonds, equities, FX pairs, futures, CDS, ...) |
| `domain.counterparties` | Trading counterparties |
| `domain.books` | Trading books deals are assigned to |
| `domain.ssis` | Standing settlement instructions per counterparty/currency |
| `domain.curves`, `domain.curve_points` | Market curve definitions and their tenor/rate grid points |
| `domain.fixings` | Published index fixings (e.g. SOFR, CORRA) used for floating-rate resets |

## Deal lifecycle

| Table | Purpose |
| --- | --- |
| `domain.deal_instructions`, `domain.deal_instruction_items` | Desk-to-trader instructions to execute, amend, terminate, or hedge — claimed and worked before a deal exists |
| `domain.deals` | The central entity — every captured financial transaction, keyed by `product_type`/`asset_class`/`product_subtype` |
| `domain.instrument_events` | Lifecycle events on sharable instruments (coupons, calls, maturities, corporate actions) |
| `domain.cashflows` | Scheduled and realized cashflows for a deal |
| `domain.compliance_checks` | Pre-trade/post-trade compliance check results |

See [Deal state machine](/concepts/deal-state-machine) and
[Capture & STP](/concepts/capture-stp).

## Valuation

| Table | Purpose |
| --- | --- |
| `domain.valuations` | Summary-level valuation per deal per date (`eod`, `intraday`, or `manual`) |
| `domain.valuation_details` | Line-level valuation detail backing a summary valuation |

See [Valuation](/concepts/valuation).

## Positions

| Table | Purpose |
| --- | --- |
| `domain.positions` | Aggregated position snapshots derived from deals and events |

## Accounting

| Table | Purpose |
| --- | --- |
| `domain.journal_entries` | Double-entry journal headers (`initial`, `accrual`, `mtm`, `realized_pnl`, `settlement`, `fee`, `manual`, `reversal`) |
| `domain.journal_lines` | Debit/credit lines belonging to a journal entry |

See [Accounting](/concepts/accounting).

## Settlement and payment

| Table | Purpose |
| --- | --- |
| `domain.settlements` | Projected/instructed/sent payment obligations per deal, partitioned by `payment_date` |
| `domain.netting_sets` | Netting groupings that collapse multiple settlements into one payment |
| `domain.payment_messages` | Outbound payment messages (e.g. SWIFT) generated from settlements |
| `domain.margin_entries` | Variation margin calculations (for margined products such as futures) |
| `domain.collateral_movements` | Collateral delivered/received against margin calls |

See [Settlement & netting](/concepts/settlement-netting).

## Closeout

| Table | Purpose |
| --- | --- |
| `domain.closeout_batches`, `domain.closeout_items` | Batches and per-deal items for an early-termination/default closeout run |
| `domain.closeout_rules` | Configurable rules driving closeout valuation and netting |

See [Closeout](/concepts/closeout).

## Workflow

| Table | Purpose |
| --- | --- |
| `domain.approval_requests` | Pending/decided approval requests, carrying `required_scope`, `chain_id`, and `step_order` |
| `domain.approval_rules` | Configuration driving which actions require approval and by whom |
| `domain.stp_rules` | Straight-through-processing rules that auto-approve or auto-route instructions |

See [Approval chains](/concepts/approval-chains).

## Audit

| Table | Purpose |
| --- | --- |
| `audit.user_actions` | Every user-initiated action, independent of the event store |
| `audit.data_lineage` | Traceability of derived data back to source events |
| `audit.reconciliations` | Reconciliation run results |
| `audit.system_events` | System-level (non-user) audit events |
| `audit.regulatory_submissions` | Records of regulatory report submissions |
| `audit.config_changes` | Audit trail of configuration changes |

## What is not covered here

Credit/risk-limit tables, internal-party records, and bank-account tables are
gated by their own scopes (`credit:*`, `risk:*`, `parties:internal:*`,
`bank_accounts:*` — see [Scopes & entitlements](/reference/scopes)) but are
not part of the `docs/DataDictionary_v1.0.md` snapshot this page summarizes.
For the authoritative, current table list and relationships, use the
[ERD](/reference/erd); for the JSON shape of each product and instrument type,
use the [Schema catalog](/reference/schema-catalog).
