---
id: book-a-trade
title: Book a trade
description: A task-focused walkthrough of booking a deal end to end.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Book a trade

A focused, copy-pasteable walkthrough of capturing a draft deal, confirming its
state transition, and reading the resulting event history.

This guide assumes the API is already running locally. If not, start with
[Run locally](/guides/run-locally).

## 1. Pick a counterparty and a book

Query the current reference data and choose one active counterparty plus one
book:

```bash
curl -sS http://localhost:8080/api/v1/parties/counterparties | jq '.[0:5] | map({id, name})'
curl -sS http://localhost:8080/api/v1/books | jq '.[0:5] | map({id, name, baseCurrency})'
```

Export the UUIDs you want to use:

```bash
export COUNTERPARTY_ID=<counterparty-uuid>
export BOOK_ID=<book-uuid>
```

If your environment is empty, seed a demo desk first with `trms-demo`; see the
[`trms-demo` reference](/reference/cli#trms-demo--seeder-cli).

## 2. Capture a draft swap

This example mirrors the happy-path swap capture already exercised in the
backend API tests:

```bash
DEAL_ID=$(
  curl -sS -X POST http://localhost:8080/api/v1/deals \
    -H "Content-Type: application/json" \
    -d "{
      \"productType\": \"swap\",
      \"productSubtype\": \"vanilla\",
      \"assetClass\": \"rates\",
      \"notional\": 50000000.00,
      \"currency\": \"CAD\",
      \"counterpartyId\": \"${COUNTERPARTY_ID}\",
      \"bookId\": \"${BOOK_ID}\",
      \"effectiveDate\": \"2026-03-17\",
      \"details\": {
        \"legs\": [{\"type\": \"fixed\", \"rate\": 0.035}],
        \"maturity_date\": \"2028-03-17\"
      }
    }" | jq -r '.id'
)

echo "$DEAL_ID"
```

Expected result:

- HTTP `201`
- a new deal UUID
- `status = "draft"`

## 3. Read the captured deal back

```bash
curl -sS "http://localhost:8080/api/v1/deals/${DEAL_ID}?expand=true" | jq .
```

Useful fields to inspect:

- `status`
- `version`
- `allowedTransitions`
- `counterparty`
- `book`

## 4. Transition the deal to `confirmed`

```bash
curl -sS -X PATCH "http://localhost:8080/api/v1/deals/${DEAL_ID}/status" \
  -H "Content-Type: application/json" \
  -d '{"targetStatus":"confirmed"}' | jq .
```

Expected result:

- HTTP `200`
- `status = "confirmed"`

If you try an invalid transition such as `cancelled` directly from `draft`, the
API returns `422 invalid_transition`.

## 5. Inspect the lifecycle history

```bash
curl -sS "http://localhost:8080/api/v1/deals/${DEAL_ID}/history" | jq .
```

That gives you the deal-centric event sequence after capture and confirmation.

## Related reading

- [Deal state machine](/concepts/deal-state-machine)
- [Capture a new deal](/reference/api/capture)
- [Transition deal status](/reference/api/transition)
- [Get deal event history](/reference/api/history)
