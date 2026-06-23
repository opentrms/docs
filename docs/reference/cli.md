---
id: cli
title: CLI
description: The trms command-line interface (deal, approval, chat) and the trms-demo seeder, as implemented with picocli.
---

<div className="eyebrow">Reference</div>

<StatusBadge status="draft" reviewed="2026-06-23" />

# CLI

OpenTRMS ships two separate picocli-based command-line tools, both thin HTTP
clients against the REST API rather than embedded business logic:

| Tool | Module | Purpose |
| --- | --- | --- |
| `trms` | `trms-ai` (`io.trms.ai.cli.TrmsCli`) | Operator-facing CLI: capture/inspect deals, work approvals, open an AI chat session |
| `trms-demo` | `trms-demo` (`io.trms.demo.cli.Main`) | Seeds a local PostgreSQL database with a demo dataset — not an end-user tool |

This page documents both as currently implemented. Neither is a full
replacement for the REST API or the MCP tools — `trms` covers a deliberately
small slice (deals, approvals, chat) and offers no commands today for EOD,
settlements, journals, or audit, despite those existing as REST endpoints and
scopes.

## `trms` — operator CLI

Entry point: `TrmsCli`. Reads the API base URL from the `TRMS_API_URL`
environment variable (falls back to `http://localhost:8080`). Every subcommand
supports `--format text|json` (default `text`).

```
trms deal list
trms deal capture --product-type swap --asset-class rates --currency USD \
  --notional 10M --counterparty-id <uuid> --book-id <uuid> --effective-date 2026-07-01
trms approval approve --id <uuid> --comment "Approved by trader"
trms chat --session-type deal_capture
```

### `trms deal`

| Subcommand | Options | Notes |
| --- | --- | --- |
| `capture` | `--product-type`, `--asset-class`, `--product-subtype` (default `vanilla`), `--currency`, `--notional`, `--counterparty-id`, `--book-id`, `--effective-date`, `--details` (JSON), `--format` | `POST /api/v1/deals`; notional accepts shorthand like `10M`, `1.5B`, `500K` |
| `list` | `--product-type`, `--asset-class`, `--status`, `--format` | `GET /api/v1/deals` with query filters |
| `get` | `--id`, `--format` | `GET /api/v1/deals/{id}` |
| `amend` | `--id`, `--notional`, `--currency`, `--details`, `--comment`, `--format` | `PATCH /api/v1/deals/{id}`; fetches current version first for optimistic concurrency; requires at least one of `--notional`/`--currency`/`--details` |
| `transition` | `--id`, `--status`, `--comment`, `--format` | `PATCH /api/v1/deals/{id}/status`; validates `--status` against the known deal-status set client-side before calling the API |
| `terminate` | `--id`, `--comment`, `--format` | `POST /api/v1/deals/{id}/terminate` |
| `cancel` | `--id`, `--comment`, `--format` | `POST /api/v1/deals/{id}/cancel` |
| `history` | `--id`, `--format` | `GET /api/v1/deals/{id}/history` |

See [Deal state machine](/concepts/deal-state-machine) for the statuses
accepted by `transition`.

### `trms approval`

| Subcommand | Options | Notes |
| --- | --- | --- |
| `list` | `--format` | `GET /api/v1/approvals` — pending approval requests |
| `approve` | `--id`, `--comment`, `--format` | `POST /api/v1/approvals/{id}/approve` |
| `reject` | `--id`, `--comment` (required), `--format` | `POST /api/v1/approvals/{id}/reject` |

See [Approval chains](/concepts/approval-chains) for how `requiredScope` and
`stepOrder` (both shown by `approval list`) drive who can act next.

### `trms chat`

Opens an interactive REPL against the AI session API.

| Option | Default | Notes |
| --- | --- | --- |
| `--session-type` | `general` | Also accepts `deal_capture`, `risk_query`, `approval_review` |
| `--provider` | `anthropic` | Also accepts `openai`, `openrouter` |
| `--model` | provider default | Optional explicit model name |
| `--format` | `text` | `text` or `json` |

Opens a session via `POST /api/v1/ai/sessions`, then streams turns through
`POST /api/v1/ai/message`. Type `exit` or `quit` to leave. This is a thin
terminal front-end for the same agent runtime described in
[Agent runtime](/concepts/agent-runtime); driving deals and approvals through
an agent rather than the REPL is covered in
[Drive via MCP](/guides/drive-via-mcp).

## `trms-demo` — seeder CLI

Entry point: `io.trms.demo.cli.Main`. This is a setup/fixture tool, not part of
the operator surface — it bootstraps a local database with a treasury-desk
demo dataset for [Run locally](/guides/run-locally) style workflows.

| Option | Default | Notes |
| --- | --- | --- |
| `--as-of` | today | Anchor date for all generated fixtures |
| `--profile` | `MINIMAL` | Seeding profile (accepts dashed or `UPPER_SNAKE` form, e.g. `full-desk` / `FULL_DESK`) |
| `--base-url` | `http://localhost:8080` | Target running TRMS API |
| `--jdbc-url` | `jdbc:postgresql://localhost:5432/trms_local` | Target database |
| `--jdbc-user` | `trms` | JDBC username |
| `--jdbc-pass` | `trms` | JDBC password |

`trms-demo` runs gap-fill SQL, loads the chosen profile, then drives the
running API through phases (market data, deals, post-trade, verification) to
populate a realistic desk. It has no subcommands — it is a single seeding run
per invocation.

## What is not here

There is currently no CLI coverage for EOD triggering, settlements, journals,
netting, or audit verification — those are REST-only (see
[API reference](/reference/api/trms-api)) or MCP-only today. Do not infer
additional `trms` subcommands beyond `deal`, `approval`, and `chat`; none
exist in `trms-ai/src/main/java/io/trms/ai/cli` as of this writing.
