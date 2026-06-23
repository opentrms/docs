---
id: accounting
title: Accounting
description: How posting rules turn valuations and lifecycle events into journal entries, and how periods close.
---

<div className="eyebrow">Concepts</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# Accounting

`trms-accounting` is the bridge between what happened to a deal and what
your general ledger says happened. It doesn't price anything or decide
lifecycle transitions — it takes a [valuation](/concepts/valuation) or a
lifecycle event and turns it into a `JournalEntry` with lines, using
posting rules configured per product type and asset class.

## Journal entries are linked, not standalone

A mark-to-market entry created from a valuation carries a `valuation_id`
pointing at the exact valuation it was derived from, in addition to the
deal it belongs to. That linkage is why amendments don't require guessing
which entry to fix: when a deal is amended after a valuation has already
been journaled, the system can look up the entry tied to the *old*
valuation specifically, reverse it, and post a new entry against the *new*
one. Posting rules are resolved by product type and asset class — they
decide which accounts get debited and credited and at what granularity, and
can attach extension data (e.g. cost center) to individual lines. Entries
start in `draft` status and carry the accounting period derived from the
valuation date.

## Reversal, not deletion

There is no "undo" for a posted journal entry — consistent with the
event-sourced principle that nothing is rewritten. Instead, `reverse_entry`
creates a new entry of type `reversal`, linked back to the original via
`reversal_of_id`, with every line's debit and credit swapped. The original
entry is untouched; the ledger now has two entries that net to zero, and the
audit trail shows exactly which entry reversed which and why. This is also
how a re-valuation after an amendment gets reflected: reverse the stale
entry, post a fresh one against the new valuation.

## Period-end close

`POST /accounting/period-close` is a gate, not a calculation. It checks that
every entry for the period is posted (no dangling drafts), that the
resulting general ledger balances, and only then locks the period. Once
locked, that period stops accepting new postings — any correction has to
happen as a reversal-and-repost in the current open period, which keeps
closed periods auditable as a fixed point rather than a moving target.
End-of-day's own `journal-entries` step (see [End-of-day](/concepts/end-of-day))
runs ahead of period-close specifically so postings exist to validate
before the gate is checked.

## Why this is a separate engine from valuation

Splitting accounting from valuation means a change to posting rules — a new
account mapping, a different cost-center extension — never touches pricing
logic, and a new `ProductValuator` never needs to know anything about debits
and credits. The two engines only share the `Valuation` record as their
interface, which keeps each one's configuration (curves and models on one
side, chart of accounts and posting rules on the other) independently
versionable. See the [schema catalog](/reference/schema-catalog) for the
journal entry and journal line table shapes.
