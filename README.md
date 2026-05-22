# Ceycode Dev Hub

A team knowledge-sharing platform built with [Docusaurus](https://docusaurus.io/). Engineers write it, engineers read it.

**Live site → [CeyCode.github.io/knowledgebase](https://CeyCode.github.io/knowledgebase/)**

---

## What's in here

| Section | Purpose |
|---|---|
| **Knowledge Base** | Reference articles — concepts, guides, comparisons, best practices |
| **Blog** | TILs, quick tips, personal experience write-ups |
| **Tags** | Cross-cutting index across all content |

Knowledge base content lives in `docs/` organised by category (Languages, Frameworks, Tools, Concepts, Best Practices). Blog posts live in `blog/`.

---

## Running locally

Prerequisites: Node.js 18+

```bash
npm install
npm start        # dev server at http://localhost:3000
```

Most edits (markdown, config) hot-reload without a restart.

```bash
npm run build    # production build → build/
npm run serve    # preview the production build locally
```

---

## Deploying

The site deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

To deploy manually:

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch.

---

## Contributing

See [docs/contributing.md](docs/contributing.md) — or visit the [Contribute page](https://CeyCode.github.io/knowledgebase/contributing) on the live site.

The short version: add a file, fill in the frontmatter, open a PR.

---

## Tech stack

- [Docusaurus 3](https://docusaurus.io/) — static site framework
- [Mermaid](https://mermaid.js.org/) — diagrams in markdown
- [docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) — offline full-text search
- GitHub Actions + GitHub Pages — CI/CD and hosting
