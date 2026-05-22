---
title: Backend Architecture
description: How the Ceycode backend is structured — layers, patterns, and key design decisions.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Java 17+ |
| Framework | Spring Boot / Netty |
| Build tool | Gradle |
| Database | _TBD_ (PostgreSQL recommended) |
| Message queue | _TBD_ (Kafka / RabbitMQ) |
| Containerization | Docker |

## Package Structure

We use **package-by-feature**, not package-by-layer:

```text
com.ceycode.<service>/
├── config/           # Spring config beans
├── <feature-1>/
│   ├── domain/       # entities, value objects
│   ├── application/  # use cases / service logic
│   ├── infra/        # DB repos, external clients
│   └── api/          # controllers / TCP handlers
└── <feature-2>/
    └── ...
```

## Key Design Patterns

- **Hexagonal architecture** — domain logic is independent of infrastructure.
- **Event-driven** — services communicate via a message queue where possible to stay decoupled.
- **Fail fast** — validate at system boundaries (TCP connection, REST endpoint). Don't validate internally.

## TCP Server Design

See [TCP Server](../services/tcp-server.md) for a detailed breakdown of the Netty pipeline.

## Database Access

- JPA / Hibernate for relational mapping.
- Raw SQL for complex queries (avoid N+1 with `JOIN FETCH` or native queries).
- Never call the DB from the domain layer — go through the repository interface.

## Related ADRs

_Link relevant ADRs here as they are created._
