---
id: setup
title: Setup
description: Configuring OpenTRMS for a new environment.
---

<div className="eyebrow">Guides</div>

<StatusBadge status="draft" reviewed="2026-06-24" />

# Setup

Covers environment configuration beyond the local quickstart: database wiring,
profile selection, schema loading, auth mode, and test execution.

## Prerequisites

- Java 25+
- Maven 3.9+
- PostgreSQL 16+
- Docker if you plan to run Testcontainers-backed integration tests

## 1. Choose the runtime profile

OpenTRMS ships several profile modes with different expectations:

| Profile | Use it for | Key behavior |
| --- | --- | --- |
| `local` | normal development | connects to `trms_local`, permits requests without a JWT, disables RLS |
| `docker` | containerized local stack | same dev-style auth posture, different DB defaults |
| `auth-on` | signed-JWT testing | real resource-server auth using the test public key |
| `server` | deployed environments | real JWT validation via `TRMS_JWT_ISSUER_URI` |

For most contributors, start with `local`.

## 2. Point the app at PostgreSQL

The base configuration lives in `trms-api/src/main/resources/application.yml`.
By default, `local` expects:

```text
TRMS_DB_URL=jdbc:postgresql://localhost:5432/trms_local
TRMS_DB_USER=trms
TRMS_DB_PASSWORD=trms
```

You can override those per shell session:

```bash
export TRMS_DB_URL=jdbc:postgresql://localhost:5432/trms_local
export TRMS_DB_USER=trms
export TRMS_DB_PASSWORD=trms
```

Flyway is enabled by default, so schema migrations run automatically on startup.

## 3. Start the application from the repository root

Run from the repo root so `schemas/` and other shared files resolve correctly:

```bash
cd ~/ideas/opentrms
mvn -pl trms-api spring-boot:run -Dspring.profiles.active=local
```

If you prefer the packaged Spring Boot JAR:

```bash
cd ~/ideas/opentrms
mvn -pl trms-api -am package -DskipTests
java -jar trms-api/target/trms-api-exec.jar --spring.profiles.active=local
```

## 4. Understand auth in each environment

### Local and docker

`local` and `docker` are the easiest profiles for development:

- Spring Security permits all requests
- `DevUserFilter` injects a development identity and full controller scope set
- you can call the API without a bearer token

That makes these profiles ideal for manual API exploration through `/docs`.

### Auth-on and server

Use `auth-on` or `server` when you need real JWT enforcement:

- `auth-on` validates signed JWTs using the test public key in the repo
- `server` validates against your configured issuer URI

For `server`, set:

```bash
export TRMS_JWT_ISSUER_URI=https://your-idp.example.com
```

If you need the full auth-on containerized stack, apply the overlay:

```bash
cd ~/ideas/opentrms
docker compose -f docker/compose.yml -f docker/compose.auth-on.yml up --build
```

## 5. Run the integration suite

The `trms-test` module uses Testcontainers PostgreSQL. Docker must be running.

```bash
cd ~/ideas/opentrms
mvn verify -pl trms-test -am
```

Two practical rules:

- use `-am` so Maven rebuilds upstream modules from the current workspace
- expect PostgreSQL 16 semantics; there is no in-memory test database fallback

## 6. Common setup checks

```bash
curl -sS http://localhost:8080/actuator/health | jq .
curl -sS http://localhost:8080/api/v1/books | jq '.[0:3]'
```

If the app fails to boot, check these first:

- PostgreSQL is reachable at the configured JDBC URL
- you started Maven from the repository root
- Docker is running if you are using Testcontainers or the compose files

## Related reading

- [Run locally](/guides/run-locally)
- [Scopes & entitlements](/reference/scopes)
- [API reference](/reference/api/trms-api)
