---
title: Troubleshooting
description: Known issues, common errors, and their fixes across the Ceycode stack.
owner: ceycode-team
last_reviewed: 2026-05-22
sidebar_position: 10
---

# Troubleshooting

A quick-lookup guide for common errors. For production incidents use the [Runbooks](./runbooks/production-debugging.md).

## Local Development

### Docker Compose services don't start

**Symptom:** `docker compose up` exits with an error or a service keeps restarting.

**Fix:**
```bash
# Check which service failed
docker compose logs <service-name>

# Ensure no port conflicts
lsof -i :5432   # PostgreSQL
lsof -i :5000   # TCP server
```

---

### DB connection refused on startup

**Symptom:** Application throws `Connection refused` on boot.

**Fix:** The DB container isn't ready yet. The app tries to connect before Postgres finishes starting. Either wait and retry, or add a healthcheck dependency in `docker-compose.yml`:

```yaml
depends_on:
  db:
    condition: service_healthy
```

---

## TCP Server

### Devices connect but no data appears

**Symptom:** TCP connection is established (session registered) but no GPS points appear in the DB.

**Checklist:**
1. Is the device sending the correct protocol number?
2. Is the packet decoder configured for this device model?
3. Check TCP server logs for `DecoderException` or `UnknownProtocol`.

---

### High CPU on the TCP server

**Symptom:** TCP server pod CPU usage climbs to 100%.

**Common causes:**
- A tight loop in the Netty event handler (never block the event loop thread).
- Backpressure from a slow DB causing task queue buildup.
- A large spike in simultaneously connecting devices.

See [Production Debugging](./runbooks/production-debugging.md) for full diagnosis steps.

---

## Database

### Slow queries after data growth

**Symptom:** Queries that were fast before become slow.

**Fix:**
1. Run `EXPLAIN ANALYZE` on the slow query.
2. Look for missing indexes or `Seq Scan` on large tables.
3. Run `ANALYZE <table>` if statistics are stale.
4. See [Query Optimization](./database/optimization.md).

---

_Add new entries here whenever you solve a non-obvious problem — the next developer will thank you._
