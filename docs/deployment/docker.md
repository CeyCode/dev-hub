---
title: Docker
description: How Ceycode services are containerized and run locally with Docker Compose.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Local Development with Docker Compose

The `docker-compose.yml` at the root of each service repo spins up all dependencies:

```bash
# Start all services in the background
docker compose up -d

# View logs
docker compose logs -f <service-name>

# Stop all services
docker compose down

# Stop and remove volumes (resets DB)
docker compose down -v
```

## Dockerfile Standards

Every service image follows this structure:

```dockerfile
# Stage 1: build
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

# Stage 2: runtime (slim image)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Rules:
- Always use multi-stage builds to keep images small.
- Pin base image versions — never use `latest`.
- Run as a non-root user.
- No secrets in `Dockerfile` — inject via environment variables at runtime.

## Image Registry

_Document where Docker images are pushed (Docker Hub, ECR, GCR, self-hosted registry)._

## Tagging Convention

| Tag | Meaning |
|---|---|
| `latest` | Latest build from `main` (avoid using in production) |
| `v1.4.2` | Semantic version tag — use this in production |
| `sha-abc1234` | Git commit SHA — used in CI for traceability |

## Related Docs

- [Kubernetes](./kubernetes.md)
- [CI/CD](./ci-cd.md)
