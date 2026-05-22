---
title: Server Recovery
description: How to recover a Ceycode service or server that is down, unresponsive, or in a crash loop.
owner: ceycode-team
last_reviewed: 2026-05-22
severity: P1
---

## Symptoms

- Pod is in `CrashLoopBackOff` or `OOMKilled` state
- Service returns 5xx errors
- TCP server is refusing connections
- Node is NotReady

## Step 1 — Diagnose the Pod State

```bash
kubectl get pods -n ceycode-prod
kubectl describe pod <pod-name> -n ceycode-prod
kubectl logs <pod-name> -n ceycode-prod --previous
```

Look for:
- `Exit Code 137` → OOMKilled (increase memory limit or fix leak)
- `Exit Code 1` → application crash (read logs for exception)
- `Readiness probe failed` → app started but not healthy (check health endpoint)

## Step 2 — Restart the Service

```bash
# Rolling restart (zero downtime if replicas > 1)
kubectl rollout restart deployment/<service-name> -n ceycode-prod

# Watch rollout
kubectl rollout status deployment/<service-name> -n ceycode-prod
```

## Step 3 — If Restart Doesn't Help — Roll Back

```bash
kubectl rollout undo deployment/<service-name> -n ceycode-prod
```

Verify the previous version is healthy before investigating the bad deploy.

## Step 4 — Node Recovery

If the Kubernetes node itself is NotReady:

```bash
# Check node status
kubectl get nodes

# Describe the node
kubectl describe node <node-name>

# Cordon the node (stop scheduling new pods on it)
kubectl cordon <node-name>

# Drain existing pods off the node
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
```

Then restart/replace the VM in the cloud provider console.

## Step 5 — Database Recovery

If the database is unreachable:

1. Check the DB pod / managed service status.
2. If replica: promote the read replica to primary.
3. Restart the app services after DB is healthy — they will reconnect.

_Document the exact steps for the database provider used here._

## After Recovery

1. Confirm all services are healthy: `kubectl get pods -n ceycode-prod`
2. Verify device connection count is back to normal.
3. Post resolution in `#incidents`.
4. File a [post-mortem](./incident-handling.md#5-post-mortem) if P1 or P2.
