---
title: Local Setup
description: How to clone, configure, and run Ceycode projects on your local machine.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Prerequisites

List the tools and versions required to develop on this project:

- **Java** ≥ 17 (for backend services)
- **Node.js** ≥ 18 (for frontend / tooling)
- **Docker** + **Docker Compose** (for local infrastructure)
- **Git** ≥ 2.30
- IDE of choice (IntelliJ IDEA recommended for Java services)

## Cloning the Repository

```bash
git clone https://github.com/ceycode/<repo-name>.git
cd <repo-name>
```

## Environment Configuration

Copy the example env file and fill in any required values:

```bash
cp .env.example .env
```

Key variables to set:

| Variable | Description |
|---|---|
| `DB_URL` | JDBC connection string for the local database |
| `TCP_PORT` | Port the TCP server listens on |

## Starting Local Infrastructure

```bash
docker compose up -d
```

This brings up the database and any other supporting services.

## Running the Application

```bash
# Backend (Gradle)
./gradlew bootRun

# Frontend (npm)
npm install && npm run dev
```

## Verifying the Setup

- Backend health check: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost:3000`

## Common Setup Issues

| Symptom | Fix |
|---|---|
| Port already in use | Check `lsof -i :<port>` and kill the process |
| DB connection refused | Ensure `docker compose up -d` succeeded |

---

*Fill in project-specific details and update this doc whenever the setup changes.*
