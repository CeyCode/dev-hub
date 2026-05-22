---
title: Production Debugging
description: General approach to diagnosing production issues — where to look first, how to read logs, and how to escalate.
owner: ceycode-team
last_reviewed: 2026-05-22
severity: P2
---

## When to Use This Runbook

Use this as your starting point for any unexpected production behaviour before reaching for more specific runbooks.

## Step 1 — Triage

Determine scope:
- Is it one user/device, a subset, or everyone?
- Is it a new deployment or did it start spontaneously?
- Which service is implicated?

```bash
# Check pod health
kubectl get pods -n ceycode-prod

# Recent events (crashloops, OOM kills)
kubectl get events -n ceycode-prod --sort-by='.lastTimestamp' | tail -30
```

## Step 2 — Read the Logs

```bash
# Tail logs for a specific service
kubectl logs -f deployment/<service-name> -n ceycode-prod

# Grep for errors in the last hour
kubectl logs deployment/<service-name> -n ceycode-prod --since=1h | grep -i "error\|exception\|fatal"
```

Key things to look for:
- Stack traces (Java exceptions)
- `Connection refused` / `timeout` between services
- `OutOfMemoryError`
- TCP server: device disconnection storms or decode failures

## Step 3 — Check TCP Server Health

```bash
# Active device connections
kubectl exec -it deployment/tcp-server -n ceycode-prod -- \
  sh -c 'netstat -an | grep ESTABLISHED | wc -l'
```

If connections are dropping:
- Check for CPU saturation (Netty event loop blocked)
- Check for heap exhaustion (`GC overhead limit exceeded`)
- Check for upstream DB slowness causing backpressure

## Step 4 — Check Database

```sql
-- Long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '30 seconds';

-- Lock contention
SELECT * FROM pg_locks WHERE NOT granted;
```

## Step 5 — Rollback if Needed

If the issue started after a deploy:

```bash
kubectl rollout undo deployment/<service-name> -n ceycode-prod
kubectl rollout status deployment/<service-name> -n ceycode-prod
```

## Escalation

| Severity | Action |
|---|---|
| P1 — production down | Page on-call tech lead immediately |
| P2 — degraded, some users affected | Open incident, notify team in Slack |
| P3 — minor issue | Create bug ticket, fix in next sprint |

## Post-Incident

After resolving: update or create a specific runbook for this issue so the next responder finds it faster.

## Related Runbooks

- [Incident Handling](./incident-handling.md)
- [Server Recovery](./server-recovery.md)
