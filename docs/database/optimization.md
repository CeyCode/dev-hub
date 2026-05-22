---
title: Query Optimization
description: Indexing strategies, common query patterns, and performance guidelines for the Ceycode database.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Indexing Rules

- Every foreign key column must have an index.
- Columns used in `WHERE`, `JOIN ON`, or `ORDER BY` are candidates for indexing.
- Use **partial indexes** for filtered queries (e.g. `WHERE deleted_at IS NULL`).
- Use **composite indexes** only when both columns appear together in queries — order matters.

## Analysing Slow Queries

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Look for:
- `Seq Scan` on large tables — usually needs an index.
- High `rows` estimates vs. actual — stale statistics (`ANALYZE <table>`).
- Nested loop joins with large row counts.

Enable `pg_stat_statements` to find the slowest queries by total time:

```sql
SELECT query, total_exec_time, calls
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

## GPS Points Table

The `gps_points` table grows very fast. Key optimizations:

- Partition by month using range partitioning on `recorded_at`.
- Index on `(device_id, recorded_at DESC)` for latest-point queries.
- Retain raw points for 90 days; aggregate to hourly summaries for older data.

## N+1 Query Prevention

- Use `JOIN FETCH` in JPQL for eagerly loading associations.
- Use `@EntityGraph` for conditional loading.
- Never call the DB inside a loop.

## Connection Pooling

Use HikariCP (Spring Boot default). Tune pool size:

```
maximumPoolSize = (cpu_cores * 2) + number_of_spinning_disks
```

Monitor pool wait time via Micrometer + Prometheus.
