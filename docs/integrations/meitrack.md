---
title: Meitrack
description: How Ceycode integrates with Meitrack GPS tracking devices.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## What is Meitrack?

Meitrack is a GPS tracker manufacturer. Their devices connect to Ceycode's TCP server over persistent TCP connections and send location and event data using the Meitrack binary protocol.

## Protocol Overview

Meitrack devices use a proprietary binary protocol. Packets are framed with a start marker and contain:
- Device IMEI
- Protocol number (event type)
- GPS coordinates, speed, heading
- Alarm codes and I/O status

## Supported Devices

_List the specific Meitrack models Ceycode supports._

## Packet Decoding

See [TCP Server — Packet Decoding](../services/tcp-server.md#packet-decoding) for the decoding pipeline.

_Document Meitrack-specific packet format here._

## Connection Lifecycle

1. Device powers on and connects to TCP server on port `5000`.
2. Device sends login packet (IMEI identification).
3. Server acknowledges and registers the session.
4. Device sends GPS packets at configured intervals.
5. Heartbeat keeps the session alive.

## Configuration on Device

_Document how to configure a Meitrack device to point at Ceycode's server (APN, server IP, port, report interval)._

## Known Issues

_Document any protocol quirks, firmware version inconsistencies, or edge cases discovered._
