---
title: Notification Service
description: How Ceycode sends alerts, push notifications, and emails to users.
owner: ceycode-team
last_reviewed: 2026-05-22
---

## Responsibility

The Notification Service handles outbound communications:
- Push notifications (mobile)
- Email alerts
- In-app notifications
- SMS (if applicable)

## Trigger Sources

Notifications are triggered by events published to the message queue:

| Event | Notification type | Recipients |
|---|---|---|
| _e.g. device offline_ | Push + Email | Vehicle owner |
| _e.g. geofence breach_ | Push | Fleet manager |

## Technology

_Document the messaging framework (Firebase FCM, SES, Twilio, etc.)._

## Retry & Failure Handling

_Document retry strategy and what happens when a notification fails to deliver._

## Port

Runs on port `8082`.
