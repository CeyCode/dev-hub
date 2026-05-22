---
title: Development Workflow
description: How we branch, commit, review, and merge code at Ceycode.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Branching Strategy

We follow a simplified Git Flow:

| Branch type | Naming convention | Example |
|---|---|---|
| Feature | `feature/<short-slug>` | `feature/gps-heartbeat-ack` |
| Bug fix | `fix/<short-slug>` | `fix/decoder-null-packet` |
| Docs | `docs/<short-slug>` | `docs/tcp-server-overview` |
| Release | `release/<version>` | `release/1.4.0` |
| Hotfix | `hotfix/<short-slug>` | `hotfix/session-leak` |

Always branch off `main` (or `develop` if the project uses it).

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

```
<type>(<scope>): <short summary>

[optional body]
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`

Examples:
```
feat(tcp-server): add heartbeat timeout detection
fix(decoder): handle null GPS packet gracefully
docs(runbooks): add production-debugging runbook
```

## Pull Request Process

1. Open a PR against `main` (or `develop`).
2. Fill in the PR description — what changed and why.
3. At least **1 reviewer approval** required before merge.
4. CI must pass (build + tests + lint).
5. Squash and merge (keeps history clean).

## Definition of Done

A feature is not "done" until:

- [ ] Code is reviewed and merged
- [ ] Tests cover the new behaviour
- [ ] Relevant docs in this knowledgebase are updated
- [ ] If architecture changed → a new ADR is filed

## Code Review Guidelines

- Review for correctness and clarity, not style (that's what the linter is for).
- Leave specific, actionable comments.
- Approve or request changes — don't leave PRs in limbo.
- Target 24-hour turnaround on reviews.
