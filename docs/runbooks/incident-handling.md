---
title: Incident Handling
description: The process for declaring, managing, and closing a production incident at Ceycode.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Incident Severity Levels

| Level | Definition | Response time |
|---|---|---|
| **P1** | Production completely down or data loss | Immediate |
| **P2** | Significant feature broken, many users affected | Within 30 min |
| **P3** | Minor degradation, workaround exists | Within 1 business day |

## Incident Lifecycle

### 1. Detect

Incidents are detected via:
- Monitoring alerts (set up alerts for: service down, error rate spike, connection drop)
- User reports in support channel
- Developer observation

### 2. Declare

Post in the `#incidents` Slack channel:

```
🚨 INCIDENT [P1/P2/P3]
What: <brief description of symptom>
Impact: <who/what is affected>
Started: <approximate time>
Investigating: <your name>
```

### 3. Investigate & Mitigate

Follow [Production Debugging](./production-debugging.md) to find and stop the bleeding.

Assign:
- **Incident commander** — coordinates the response
- **Technical responder** — does the actual debugging/fixing

Update the Slack thread every 15 minutes with status.

### 4. Resolve

Once the issue is fixed:
- Post resolution in `#incidents`: `✅ RESOLVED — <what was done>`
- Restore normal monitoring baseline

### 5. Post-Mortem

For P1 and P2 incidents, write a post-mortem within 48 hours:

```markdown
## Incident: <title>
**Date:** <date>
**Duration:** <how long it lasted>
**Severity:** P1/P2

### Timeline
...

### Root cause
...

### What went well
...

### What went wrong
...

### Action items
- [ ] <owner>: <fix/improvement>
```

Store post-mortems in this knowledgebase under `runbooks/` as `post-mortem-<date>-<slug>.md`.
