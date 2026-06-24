---
id: operate-eod
title: Operate end-of-day
description: Triggering and monitoring the end-of-day batch.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Operate end-of-day

This guide walks the operator flow for the current EOD surface:

- `POST /api/v1/eod/trigger`
- `GET /api/v1/eod/status/{date}`
- `GET /api/v1/eod/runs`
- `POST /api/v1/eod/rerun`
- `POST /api/v1/eod/catch-up`

In `local`, you can call these directly. In `auth-on` or `server`, the caller
needs `system:batch`.

## 1. Trigger an EOD run

Pick a business date and submit the trigger request:

```bash
EOD_DATE=2026-06-24

curl -sS -X POST \
  "http://localhost:8080/api/v1/eod/trigger?mode=HALT_ON_ERROR" \
  -H "Content-Type: application/json" \
  -d "{\"eodDate\":\"${EOD_DATE}\"}" | jq .
```

Expected result: HTTP `202 Accepted` with a run descriptor for the submitted
date.

`HALT_ON_ERROR` is the safe default because it stops the pipeline on the first
failed step.

## 2. Poll the live step snapshot

Use the status endpoint to watch the current run move through its ordered steps:

```bash
curl -sS "http://localhost:8080/api/v1/eod/status/${EOD_DATE}" | jq .
```

This is the operator-facing snapshot from `domain.eod_runs`, not the historical
attempt ledger.

## 3. Inspect run history for the date

For reruns and prior attempts, query the historical view:

```bash
curl -sS \
  "http://localhost:8080/api/v1/eod/runs?as_of_date=${EOD_DATE}" | jq .
```

Use this when you need to answer questions like:

- Was this date already processed?
- How many attempts have there been?
- Was the current run a rerun or part of a catch-up sequence?

## 4. Rerun a business date

If a date needs a clean end-to-end replay, submit a rerun with a reason:

```bash
curl -sS -X POST \
  "http://localhost:8080/api/v1/eod/rerun?mode=HALT_ON_ERROR" \
  -H "Content-Type: application/json" \
  -d "{
    \"asOfDate\": \"${EOD_DATE}\",
    \"reason\": \"Reprocessing after corrected market data load\"
  }" | jq .
```

Rerun clears the current step snapshot for that date and starts a fresh attempt.

## 5. Catch up when the environment is behind

If the persisted business date is lagging behind several days, use catch-up:

```bash
TARGET_DATE=2026-06-28

curl -sS -X POST \
  "http://localhost:8080/api/v1/eod/catch-up?mode=HALT_ON_ERROR" \
  -H "Content-Type: application/json" \
  -d "{\"targetAsOfDate\":\"${TARGET_DATE}\"}" | jq .
```

Catch-up always starts from the current stored business date and advances until
the target date is reached or one of the daily runs fails.

## 6. Run a single step for targeted backfills

For one-off operational work, for example rebuilding spread history after a data
reload, call the single-step endpoint directly:

```bash
for d in 2026-02-02 2026-02-03 2026-02-04; do
  curl -sS -X POST http://localhost:8080/api/v1/eod/step \
    -H "Content-Type: application/json" \
    -d "{\"eodDate\":\"${d}\",\"step\":\"spread_history\"}"
done
```

Use this sparingly. The normal path is still the full EOD pipeline.

## Related reading

- [End-of-day](/concepts/end-of-day)
- [Trigger an EOD run](/reference/api/trigger)
- [Get current EOD step status for a business date](/reference/api/status-1)
- [Get EOD run attempts for a business date](/reference/api/runs)
