---
title: Frontend Architecture
description: How the Ceycode frontend application is structured and how it communicates with the backend.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | _TBD_ (React / Next.js / Vue) |
| State management | _TBD_ |
| API communication | REST + WebSocket |
| Build tool | Vite / Next.js |

## Project Structure

```text
src/
├── components/    # reusable UI components
├── pages/         # route-level page components
├── hooks/         # custom React hooks
├── services/      # API client functions
├── store/         # global state
├── types/         # TypeScript type definitions
└── utils/         # pure helper functions
```

## API Communication

- REST calls via a typed API client (e.g. axios or fetch wrapper in `services/`).
- Real-time updates via WebSocket subscription.
- All API base URLs come from environment variables — never hardcoded.

## State Management

_Document the chosen state management approach and when to use local vs. global state._

## Routing

_Document the routing strategy._

## Environment Configuration

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL |
| `VITE_WS_URL` | WebSocket connection URL |
