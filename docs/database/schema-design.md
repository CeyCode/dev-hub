---
title: Schema Design
description: Core database schema design principles and entity relationship overview.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Design Principles

- **snake_case** for all table and column names.
- Every table has a surrogate primary key (`id BIGSERIAL` or `UUID`).
- Soft deletes via `deleted_at TIMESTAMPTZ` — never `DELETE` from core entity tables.
- All timestamps are stored in UTC (`TIMESTAMPTZ`).
- Foreign keys are always indexed.

## Core Entities

_Document the main entities and their relationships. Example:_

```mermaid
erDiagram
    DEVICE {
        bigint id PK
        varchar imei UK
        varchar name
        timestamptz created_at
        timestamptz deleted_at
    }
    DEVICE_SESSION {
        bigint id PK
        bigint device_id FK
        inet ip_address
        timestamptz connected_at
        timestamptz disconnected_at
    }
    GPS_POINT {
        bigint id PK
        bigint device_id FK
        decimal latitude
        decimal longitude
        smallint speed
        timestamptz recorded_at
    }
    DEVICE ||--o{ DEVICE_SESSION : "has"
    DEVICE ||--o{ GPS_POINT : "sends"
```

## Naming Conventions

| Object | Convention | Example |
|---|---|---|
| Table | `snake_case` plural | `device_sessions` |
| Column | `snake_case` | `last_seen_at` |
| Index | `idx_<table>_<column>` | `idx_gps_points_device_id` |
| Foreign key | `fk_<table>_<ref>` | `fk_sessions_device_id` |

## Partitioning

_Document any partitioned tables (e.g. `gps_points` partitioned by month)._

## Related Docs

- [Migrations](./migrations.md)
- [Query Optimization](./optimization.md)
