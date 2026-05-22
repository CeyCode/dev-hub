---
title: "Shrink your Docker images with multi-stage builds"
description: Multi-stage builds let you compile inside Docker and ship only what the app actually needs — no build tools in production.
date: 2026-05-20
authors: [ceycode-team]
tags: [tutorial, docker, containers]
---

Build tools, test dependencies, and intermediate artifacts have no business being in your production image. Multi-stage builds solve this cleanly.

{/* truncate */}

## The problem with single-stage builds

A naive Dockerfile that installs Maven, compiles a Spring Boot app, and runs it ends up with Maven, the JDK, and all your source code in the final image — easily 600–800 MB.

```dockerfile
# single-stage — too much in the final image
FROM eclipse-temurin:21
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests
CMD ["java", "-jar", "target/app.jar"]
```

## Multi-stage: build in one image, run from another

```dockerfile
# Stage 1: compile
FROM eclipse-temurin:21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2: run — just the JRE and the jar
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

The `--from=build` instruction copies only what you explicitly ask for from the build stage. Docker discards everything else.

## Result

| Approach | Image size |
|---|---|
| Single-stage (JDK + Maven + source) | ~750 MB |
| Multi-stage (JRE only) | ~230 MB |

Smaller image = faster pulls, smaller attack surface, less to scan for vulnerabilities.

## Tips

- Name your stages (`AS build`, `AS runtime`) so `--from=` is readable
- Cache the dependency download layer separately by copying `pom.xml` before `src/` — Maven will skip re-downloading if `pom.xml` hasn't changed
- Use a distroless or Alpine JRE for even smaller images

---

*Have a Docker tip? [Write a TIL or article](/kb/contributing) and share it with the team.*
