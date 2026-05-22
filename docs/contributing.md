---
title: Contributing
sidebar_position: 7
---

# Contributing to Ceycode Dev Hub

This knowledge base is built by the team, for the team. Everyone is welcome to add, improve, or fix content — no contribution is too small.

## What you can contribute

| Content type | What it's for | Where it lives |
|---|---|---|
| **Knowledge Base article** | Concepts, guides, deep dives, comparisons, best practices | `docs/` |
| **Blog post / TIL** | Short discoveries, tips, personal experience write-ups | `blog/` |

### Knowledge Base vs Blog — which one?

- **Knowledge Base** (`docs/`) — reference material the team will revisit repeatedly. It belongs to a category (Languages, Frameworks, Concepts, etc.) and has a permanent place in the sidebar.
- **Blog** (`blog/`) — things you learned recently, quick tips, tutorials written in first-person, or anything time-stamped by nature (a TIL, a post-mortem, a "we tried X" writeup).

If you're unsure, start with a blog post. Good ones often get promoted into the knowledge base later.

## How to add a blog post

1. Create a file in `blog/` named `YYYY-MM-DD-your-title.md`
2. Add the following frontmatter at the top:
   ```md
   ---
   title: Your Post Title
   authors: your_handle
   tags: [relevant, tags]
   description: One-line summary shown in previews.
   ---
   ```
3. Add yourself to `blog/authors.yml` if you're not already there:
   ```yaml
   your_handle:
     name: Your Name
     title: Your Role
     url: https://github.com/your-github
     image_url: https://github.com/your-github.png
   ```
4. Write your content below the frontmatter.
5. Open a pull request — it'll be reviewed and merged quickly.

## How to add a Knowledge Base article

1. Find the right category in `docs/` — `languages/`, `frameworks/`, `tools/`, `concepts/`, or `best-practices/`.
2. If a new category is needed, create a folder and add a `_category_.json` file inside it:
   ```json
   {
     "label": "Your Category",
     "position": 10,
     "link": { "type": "generated-index" }
   }
   ```
3. Create your `.md` file with frontmatter:
   ```md
   ---
   title: Article Title
   sidebar_label: Short Label
   description: One-line summary.
   tags: [relevant, tags]
   ---
   ```
4. Write the article. Use headings, code blocks, and Mermaid diagrams where they help.
5. Open a pull request with a short description of what you added.

## Tagging

Tags power the [Tags page](/tags) and make content discoverable. Use them consistently:

- **Technology**: `java`, `typescript`, `react`, `docker`, `kubernetes`, `git`, `spring-boot`, `python`, `go`
- **Content type**: `tutorial`, `til`, `best-practices`, `deep-dive`, `comparison`
- **Topic**: `performance`, `security`, `databases`, `system-design`, `ci-cd`, `testing`, `networking`, `server-architecture`

## Principles

- **Share early** — a rough draft beats a perfect article that never gets written.
- **Be specific** — concrete examples and real code are more useful than abstract explanations.
- **Link, don't repeat** — if something is covered elsewhere in the hub, link to it.
- **Keep it current** — if you spot outdated content, update it in the same PR or open an issue.

## What makes a good contribution

- Grounded in a real experience, not just a paraphrase of the official docs.
- At least one code example if the topic involves code.
- A "why it matters" angle — not just *what*, but why a teammate should care.
- Correct frontmatter so it appears in the right place and is tagged properly.
