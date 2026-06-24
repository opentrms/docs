---
id: run-locally
title: Run OpenTRMS locally
description: Bring up the OpenTRMS stack on your own machine.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Run OpenTRMS locally

The fastest local developer loop is a real PostgreSQL 16 instance on
`localhost:5432`, plus the `trms-api` Spring Boot application running with the
`local` profile from the repository root. In this profile, Flyway migrations run
on startup, row-level security is disabled, and the dev security filter permits
requests without a JWT.

See the [Quickstart](/) for the abbreviated version. This page expands the flow
with the exact commands and checks you want for a repeatable local setup.

## Prerequisites

- Java 25+
- Maven 3.9+
- Docker, or your own PostgreSQL 16 instance
- A clone of the backend repository at `~/ideas/opentrms` or equivalent

## 1. Start PostgreSQL

If you do not already have PostgreSQL running locally, start a disposable
container:

```bash
docker run --name opentrms-postgres \
  -e POSTGRES_DB=trms_local \
  -e POSTGRES_USER=trms \
  -e POSTGRES_PASSWORD=trms \
  -p 5432:5432 \
  -d postgres:16
```

Wait until the database is accepting connections:

```bash
docker exec opentrms-postgres pg_isready -U trms -d trms_local
```

Expected result: `accepting connections`.

## 2. Start the API from the repository root

Run the application from the root of the backend repo, not from `trms-api/`.
That matters because shared files such as `schemas/` are resolved relative to
the repository root.

```bash
cd ~/ideas/opentrms
mvn -pl trms-api spring-boot:run -Dspring.profiles.active=local
```

By default, the `local` profile uses:

- `TRMS_DB_URL=jdbc:postgresql://localhost:5432/trms_local`
- `TRMS_DB_USER=trms`
- `TRMS_DB_PASSWORD=trms`
- port `8080`

Override those with environment variables if you need a different database.

## 3. Verify the local surface

In a second terminal:

```bash
curl -sS http://localhost:8080/actuator/health | jq .
curl -sS http://localhost:8080/api/v1/books | jq '.[0:5]'
open http://localhost:8080/docs
```

What to expect:

- `GET /actuator/health` returns `UP`
- `GET /api/v1/books` returns JSON, even without a token in `local`
- Swagger UI is available at `http://localhost:8080/docs`

## 4. Optional: run the fully containerized stack

The backend repo also has `docker/compose.yml`, but that file is aimed at the
`docker` profile and a containerized API+database stack rather than the default
local developer loop:

```bash
cd ~/ideas/opentrms
docker compose -f docker/compose.yml up --build
```

Use that when you want the app itself inside Docker. For day-to-day development,
the `local` profile plus a local PostgreSQL instance is simpler and matches the
repo's documented default settings more closely.

## 5. Stop the stack

If you used the disposable container:

```bash
docker stop opentrms-postgres
docker rm opentrms-postgres
```

## Related reading

- [Setup](/guides/setup)
- [Book a trade](/guides/book-a-trade)
- [API reference](/reference/api/trms-api)
