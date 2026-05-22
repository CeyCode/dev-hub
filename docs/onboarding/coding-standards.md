---
title: Coding Standards
description: Conventions and standards the Ceycode team follows across all codebases.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## General Principles

- **Clarity over cleverness.** Write code the next developer can understand immediately.
- **Small, focused units.** Functions do one thing. Classes own one concern.
- **Fail fast.** Validate inputs at system boundaries (HTTP, TCP, message queue). Trust internal code.
- **No silent failures.** Log errors with context. Don't swallow exceptions.

## Java / Backend

- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html).
- Use Checkstyle via Gradle — CI will reject violations.
- Prefer `Optional` over returning `null` from public APIs.
- Use `@Slf4j` (Lombok) for logging. Don't use `System.out.println`.
- Package by feature, not by layer (`com.ceycode.tracking.session`, not `com.ceycode.service`).

## JavaScript / TypeScript / Frontend

- TypeScript everywhere — no `any` unless absolutely unavoidable.
- ESLint + Prettier enforced in CI.
- Functional components with hooks for React.
- Keep components small; extract logic into custom hooks.

## Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Java classes | PascalCase | `TcpSessionManager` |
| Java methods / vars | camelCase | `parseHeartbeatPacket` |
| DB tables | snake_case | `device_sessions` |
| DB columns | snake_case | `last_seen_at` |
| REST endpoints | kebab-case | `/api/v1/device-sessions` |
| Environment variables | SCREAMING_SNAKE_CASE | `TCP_SERVER_PORT` |

## Comments

Only comment when the **why** is non-obvious. Don't describe what the code does — the code does that.

```java
// Good: explains a hidden constraint
// Netty requires channel.close() to be called from the event loop thread
channel.eventLoop().execute(channel::close);

// Bad: restates the code
// Close the channel
channel.close();
```

## Testing

- Unit tests for pure logic; integration tests for I/O boundaries.
- Don't mock the database in integration tests.
- Test class naming: `<ClassName>Test` (unit) / `<ClassName>IT` (integration).
- Aim for meaningful coverage, not a coverage number.
