---
title: Kubernetes
description: How Ceycode services are deployed and managed in Kubernetes.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Cluster Overview

_Document the cluster setup (provider, node pools, namespaces)._

| Namespace | Purpose |
|---|---|
| `ceycode-prod` | Production workloads |
| `ceycode-staging` | Staging workloads |
| `ceycode-infra` | Shared infrastructure (DB proxies, monitoring) |

## Deployment Structure

Each service has a standard set of Kubernetes manifests:

```text
k8s/
├── deployment.yaml
├── service.yaml
├── configmap.yaml
└── hpa.yaml          # Horizontal Pod Autoscaler
```

## Resource Limits

Always set both `requests` and `limits`:

```yaml
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 512Mi
```

## Health Checks

All services must expose:
- `/actuator/health/liveness` → `livenessProbe`
- `/actuator/health/readiness` → `readinessProbe`

## Scaling

The TCP server uses a `StatefulSet` (not `Deployment`) because device sessions are sticky to a specific pod. All other services use `Deployment` with an HPA.

## Useful Commands

```bash
# View all pods
kubectl get pods -n ceycode-prod

# Tail logs for a pod
kubectl logs -f <pod-name> -n ceycode-prod

# Describe a pod (for debugging crashloops)
kubectl describe pod <pod-name> -n ceycode-prod

# Rolling restart a deployment
kubectl rollout restart deployment/<name> -n ceycode-prod
```

## Related Docs

- [Docker](./docker.md)
- [CI/CD](./ci-cd.md)
- [Infrastructure](../architecture/infrastructure.md)
