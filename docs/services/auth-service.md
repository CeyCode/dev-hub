---
title: Auth Service
description: How authentication and authorization work across Ceycode services.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Responsibility

The Auth Service is the single source of truth for:
- Issuing access tokens (JWT)
- Validating tokens on behalf of other services
- Managing user sessions

## Technology

_Document the framework and token strategy used._

## Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Exchange credentials for a token pair |
| `POST` | `/auth/refresh` | Refresh an access token |
| `POST` | `/auth/logout` | Invalidate the session |
| `GET` | `/auth/validate` | Validate a token (used by other services) |

## Token Strategy

_Document token type (JWT / opaque), expiry times, and refresh strategy._

## Inter-service Auth

_How do backend services authenticate with each other? (mTLS, shared secret, internal JWT, etc.)_

## Port

Runs on port `8081`.

## Related Docs

- [System Overview](../architecture/system-overview.md)
