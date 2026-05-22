---
title: <Incident Title or Symptom>
description: <One-line summary of what this runbook covers>
owner: <oncall-team or your-github-handle>
last_reviewed: <YYYY-MM-DD>
severity: <P1 | P2 | P3>
---

## Symptoms

How do you know this is happening? What alerts fire? What do users report?

## Diagnosis

Metrics to check, logs to grep, dashboards to open.

```bash
# Example diagnostic commands
kubectl logs deployment/<service> -n ceycode-prod --since=1h | grep -i error
```

## Mitigation

Step-by-step actions to stop the bleeding (even if root cause is unknown).

1.
2.
3.

## Root-Cause Investigation

What to look at after the immediate issue is resolved.

## Rollback / Recovery

How to safely revert if mitigation made things worse.

```bash
kubectl rollout undo deployment/<service> -n ceycode-prod
```

## Prevention

What can be done to prevent this from happening again? (Link to a follow-up ticket.)
