---
title: Testing
sidebar_position: 2
tags: [best-practices, testing]
---

# Testing Best Practices

Principles for writing tests that are valuable, maintainable, and trustworthy.

## Core principles

- Test behaviour, not implementation — tests should survive refactoring
- Arrange / Act / Assert — keep each phase clear and separate
- One assertion per concept (not necessarily per test)
- Prefer integration tests over unit tests for I/O-heavy code

## What to avoid

- Testing private methods directly
- Mocking things you don't own (e.g., third-party libraries)
- Tests that only pass in CI or only pass locally
- Snapshot tests without a clear reason to use them

> Know a testing pattern that's worked well? [Write it up](/kb/contributing).
