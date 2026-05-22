---
title: Code Review
sidebar_position: 1
tags: [best-practices, code-review]
---

# Code Review Best Practices

How we give and receive code reviews effectively as a team.

## As a reviewer

- Review the logic, not the style (let the linter handle style)
- Ask questions before making assertions — assume the author had a reason
- Keep comments small and focused; one concern per comment
- Distinguish must-fix from nice-to-have (prefix with `nit:`)

## As an author

- Keep PRs small — under 400 lines is a good target
- Write a clear description: what changed and why
- Self-review before requesting review
- Respond to every comment, even if just to acknowledge

> Have a tip that's changed how your reviews go? [Share it](/contributing).
