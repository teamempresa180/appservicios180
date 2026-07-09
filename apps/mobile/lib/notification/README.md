# Notification Module (Flutter)

## Qué representa

`notification` modela únicamente una notificación enviada por el sistema a
una identidad: título, cuerpo, tipo, estado de lectura y momento de
creación/lectura. No tiene `updatedAt`, solo `createdAt` y `readAt`.

## Diferencia entre Notification y Chat

`Notification` es un aviso unidireccional del sistema. `Chat` (módulo
futuro) sería una conversación bidireccional entre personas.

## Diferencia entre Notification y Message

Un `Message` futuro sería contenido intercambiado entre personas dentro de
una conversación. `Notification` es generada por el sistema, no por una
persona.

## Por qué Notification solo referencia IdentityId

`Notification` importa únicamente `IdentityId` — nunca la entidad completa.

## Cómo permitirá conectar posteriormente Firebase Cloud Messaging, Email, SMS, Push Notifications, WebSockets, RabbitMQ, Kafka sin modificar este dominio

Todos esos canales de entrega futuros consumirán `Notification` como fuente
de contenido, referenciando `NotificationId` — sin que este dominio conozca
tokens, dispositivos ni colas de mensajería.

## Qué NO contiene

FCM Token, Device, Firebase, Email, SMS, Push, canales, prioridades,
WebSockets, RabbitMQ, Kafka, programación de envío, IA, persistencia,
widgets/pantallas.

## Estructura

```
notification/
  README.md
  models/
    notification_id.dart
    notification_status.dart
    notification_type.dart
  entities/
    notification.dart
```

## Relaciones

`Notification` únicamente referencia `IdentityId` (de `identity`).
`Identity` no conoce `Notification`.
