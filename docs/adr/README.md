---
title: About ADRs
description: What ADRs are and how to write one.
owner: ceycode-team
last_reviewed: 2026-05-22
---

# Architecture Decision Records

An ADR documents a significant architectural decision — the context behind it, the options considered, and why a specific choice was made.

## Why We Keep ADRs

Without them, teams repeatedly ask "why did we do it this way?" and risk undoing decisions that were already thought through.

## ADR Template

```markdown
---
title: "ADR-NNNN: <Title>"
description: <one-line summary>
owner: <github-handle>
last_reviewed: <YYYY-MM-DD>
---

# ADR-NNNN: <Title>

- **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX
- **Date:** <YYYY-MM-DD>

## Context
<What situation or constraint forced this decision?>

## Options Considered
1. **Option A** — pros/cons
2. **Option B** — pros/cons

## Decision
<What we decided and why.>

## Consequences
<What becomes easier or harder as a result of this decision.>
```

## Filing a New ADR

1. Find the highest existing ADR number and increment by 1.
2. Create `docs/adr/NNNN-short-title.md`.
3. Set status to `Proposed`.
4. Open a PR — get team review before setting to `Accepted`.
