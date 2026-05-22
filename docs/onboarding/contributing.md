---
title: Contributing to the Knowledgebase
description: How to add, edit, and review documentation in this knowledgebase.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## When to Add a Doc

Documentation is part of the **Definition of Done**. Update or create a doc whenever you:

- Add a new feature or service
- Change an architecture or integration
- Fix a recurring production issue (add a runbook)
- Make a significant technical decision (file an ADR)

## Workflow

1. **Branch:** `git checkout -b docs/<short-slug>`
2. **Pick the right section** — use the table below.
3. **Copy a template** from `docs/_templates/` and fill it in.
4. **Open a PR** — one reviewer required, CI must pass.
5. **Merge** with squash.

## Which Section?

| What you're documenting | Section |
|---|---|
| Setup, workflow, conventions | `onboarding/` |
| How a system or service works internally | `architecture/` or `services/` |
| External vendor / device / API | `integrations/` |
| DB schema, migrations, queries | `database/` |
| Docker, Kubernetes, CI/CD | `deployment/` |
| Production incident procedure | `runbooks/` |
| Why a major technical decision was made | `adr/` |
| Definitions of terms | `glossary.md` |
| Known bugs / gotchas | `troubleshooting.md` |

## Frontmatter Required Fields

Every doc must include:

```yaml
---
title: ...
description: ...   # one-line summary shown in search results
owner: ...         # your GitHub handle or team name
last_reviewed: ... # ISO date (YYYY-MM-DD)
---
```

## Doc Writing Guidelines

- Answer: **What problem? Why does it matter? How does it work? How do I use it? What to avoid?**
- Keep docs small and focused — one topic per file.
- Use Mermaid for diagrams (renders inline, version-controlled).
- Link related docs with relative Markdown links.

## ADR Numbering

ADRs are numbered sequentially. Check the highest existing number in `docs/adr/` and increment by one.

Format: `docs/adr/NNNN-short-title.md` (e.g. `0002-use-kafka-for-events.md`)
