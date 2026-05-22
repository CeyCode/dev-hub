---
title: Contributing
sidebar_position: 7
---

# Contributing to the Dev Hub

This platform belongs to everyone on the team. Here's how to add to it.

## Principles

- **Share early** — a rough draft is more valuable than a perfect article that never gets written
- **Be specific** — concrete examples beat abstract explanations every time
- **Link liberally** — if something is covered elsewhere, link to it rather than repeating it
- **Keep it current** — if you notice outdated content, update it

## Content types and when to use each

| Type | Use for | Lives in | Template |
|---|---|---|---|
| **TIL** | Short discoveries, quick tips | `blog/` | [TIL template](/templates/til) |
| **Tutorial** | Step-by-step how-to guides | `docs/` | [Tutorial template](/templates/tutorial) |
| **Best Practice** | Team-agreed standards | `docs/best-practices/` | [Best Practice template](/templates/best-practice) |
| **Deep Dive** | In-depth technical exploration | `docs/` | [Deep Dive template](/templates/deep-dive) |
| **Comparison** | X vs Y trade-off analysis | `docs/` | [Comparison template](/templates/comparison) |

## Writing a blog post (TIL / Article)

1. Create a file in `blog/` named `YYYY-MM-DD-your-title.md`
2. Add frontmatter: `title`, `authors`, `tags`, `description`
3. Add yourself to `blog/authors.yml` if you're not already there
4. Open a PR — it'll be reviewed and merged quickly

## Adding to the knowledge base

1. Find the right section in `docs/` (or propose a new one)
2. Copy the relevant template from `docs/_templates/`
3. Fill it in — dummy sections are fine for a first draft
4. Open a PR with a short description

## Tagging

Tags power the [Tags page](/tags). Use them consistently:

- **Technology tags**: `java`, `typescript`, `react`, `docker`, `kubernetes`, `git`, `spring-boot`, `python`, `go`
- **Type tags**: `tutorial`, `til`, `best-practices`, `deep-dive`, `comparison`
- **Topic tags**: `performance`, `security`, `databases`, `system-design`, `ci-cd`, `testing`

## What makes a good contribution

- A real experience, not a paraphrase of the docs
- At least one code example if the topic involves code
- A "why it matters" angle — not just what, but why a teammate should care
