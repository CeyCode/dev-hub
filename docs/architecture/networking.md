---
title: Networking
description: Network topology, port assignments, and communication protocols used across Ceycode services.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Port Registry

Keep this table up to date as services are added.

| Service | Protocol | Port | Notes |
|---|---|---|---|
| TCP Server | TCP | `5000` | IoT device connections |
| API Backend | HTTP | `8080` | REST API |
| Auth Service | HTTP | `8081` | Token endpoints |
| Notification Service | HTTP | `8082` | |
| PostgreSQL | TCP | `5432` | Internal only |
| Message Queue | TCP | _TBD_ | |

## Protocols

### TCP (IoT Devices)
Devices maintain persistent TCP connections to the TCP server. Each device sends binary-encoded GPS and event packets. See [TCP Server](../services/tcp-server.md) for the packet format.

### REST (Client ↔ Backend)
Standard HTTP/1.1 JSON REST API. All public endpoints are versioned under `/api/v1/`.

### WebSocket (Real-time updates)
Clients subscribe to live vehicle/device updates over WebSocket.

## Firewall Rules

_Document which ports are open to the internet vs. internal-only._

## TLS / Certificates

_Document the TLS strategy for each protocol._
