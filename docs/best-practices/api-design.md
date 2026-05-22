---
title: API Design
sidebar_position: 3
tags: [best-practices, api-design]
---

# API Design Best Practices

Principles for designing APIs that are intuitive, consistent, and evolvable.

## REST conventions

- Use nouns for resources, verbs for HTTP methods — `GET /orders`, not `GET /getOrders`
- Return appropriate status codes — `201` for creation, `204` for deletion, `422` for validation errors
- Version from day one (`/v1/`) — adding a version later is painful
- Consistent error shape: `{ "error": { "code": "...", "message": "..." } }`

## Things to decide early

- Pagination strategy (cursor vs offset) — cursor scales better
- Naming convention (camelCase vs snake_case) — pick one and stick to it
- How you handle partial updates (PUT vs PATCH)

> Have a pattern or gotcha worth documenting? [Contribute it](/kb/contributing).
