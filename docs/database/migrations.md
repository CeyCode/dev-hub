---
title: Migrations
description: How database schema changes are managed and applied across environments.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Migration Tool

_Document the migration tool used (Flyway / Liquibase / manual scripts)._

## File Naming

Flyway convention: `V<version>__<description>.sql`

```text
db/migration/
├── V1__create_devices_table.sql
├── V2__create_device_sessions_table.sql
├── V3__create_gps_points_table.sql
└── V4__add_device_name_column.sql
```

Version numbers are sequential integers. Never reuse or modify a committed migration.

## Writing a Migration

Rules:
1. **Never modify** an already-committed migration file — write a new one instead.
2. Migrations must be **backward-compatible** with the previous app version (zero-downtime deployments).
3. For large tables, prefer `ADD COLUMN ... DEFAULT NULL` then backfill asynchronously.
4. Always test `UP` and `DOWN` (rollback) migrations locally before pushing.

## Applying Migrations

Migrations run automatically on application startup via Flyway.

To run manually:
```bash
./gradlew flywayMigrate
```

To check current state:
```bash
./gradlew flywayInfo
```

## Zero-downtime Migration Checklist

For tables with > 1M rows:

- [ ] Add column as nullable first
- [ ] Deploy app (both old and new version can work without the column)
- [ ] Backfill data in batches
- [ ] Add `NOT NULL` constraint after backfill
- [ ] Deploy final app version that depends on the column

## Rollback

If a migration must be rolled back: write a new `V<N+1>__rollback_<description>.sql` — do not edit the original.
