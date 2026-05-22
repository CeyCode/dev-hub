---
title: "TIL: Stream.toList() vs Collectors.toList() in Java"
description: Java 16 added Stream.toList() — but it's not a drop-in replacement for Collectors.toList().
date: 2026-05-22
authors: [kavinda]
tags: [til, java, streams]
---

Java 16 introduced `Stream.toList()` as a shorter way to collect a stream into a list. Looks like a simple convenience method — turns out there's a meaningful difference.

{/* truncate */}

## Context

I was simplifying some stream pipelines and swapped `collect(Collectors.toList())` for the newer `Stream.toList()`. Tests started failing with `UnsupportedOperationException`. Not obvious why at first.

## The discovery

`Stream.toList()` returns an **unmodifiable** list. `Collectors.toList()` returns a regular mutable `ArrayList`.

```java
// Collectors.toList() — mutable, you can add/remove after
List<String> mutable = stream.collect(Collectors.toList());
mutable.add("extra"); // fine

// Stream.toList() — unmodifiable
List<String> immutable = stream.toList();
immutable.add("extra"); // throws UnsupportedOperationException
```

`Collectors.toUnmodifiableList()` existed before Java 16 and gives the same behaviour as `Stream.toList()` — so the new method is really a shorthand for the unmodifiable version, not the mutable one.

## Why it matters

If you're collecting into a list you then mutate (sorting in place, removing elements, etc.), the new shorthand will break. The fix is straightforward — use `Collectors.toList()` when you need mutability, `Stream.toList()` when you don't — but the failure mode is a runtime exception, not a compile error.

**Prefer `Stream.toList()` by default** (immutability is usually the right default), and reach for `Collectors.toList()` only when you need to mutate the result.

## Source

- [JDK-8180352](https://bugs.openjdk.org/browse/JDK-8180352) — the JEP that introduced `Stream.toList()`
- [Java 16 release notes](https://openjdk.org/projects/jdk/16/)
