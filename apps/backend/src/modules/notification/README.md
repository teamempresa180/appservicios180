# Notification Module (Backend)

## Qué representa

`Notification` modela únicamente una **notificación enviada por el sistema
a una identidad**: título, cuerpo, tipo, estado de lectura y momento de
creación/lectura. Es dominio puro — solo representa el dato de la
notificación, no cómo se entrega.

Campos representados (sin comportamiento, solo datos):

- `NotificationId`
- `IdentityId` (reutilizado de `identity`)
- `title`
- `body`
- `type`
- `status`
- `createdAt`
- `readAt`

A diferencia de otros módulos, `Notification` no tiene `updatedAt`: solo le
importa cuándo se creó y, opcionalmente, cuándo se leyó.

## Diferencia entre Notification y Chat

`Notification` es un aviso unidireccional del sistema hacia una `Identity`.
`Chat` (módulo futuro) representaría una conversación bidireccional entre
dos o más identidades — conceptos completamente distintos que no se
relacionan entre sí en este dominio.

## Diferencia entre Notification y Message

Un `Message` (concepto futuro, dentro de `Chat`) es contenido intercambiado
entre personas dentro de una conversación. `Notification` es generada por el
sistema (no por una persona) para informar de un evento — no vive dentro de
una conversación.

## Por qué Notification solo referencia IdentityId

`Notification` importa únicamente `IdentityId` — nunca la entidad `Identity`
completa. Esto mantiene el dominio de `Notification` desacoplado de los
campos internos de `identity`.

## Cómo permitirá conectar posteriormente Firebase Cloud Messaging, Email, SMS, Push Notifications, WebSockets, RabbitMQ, Kafka sin modificar este dominio

- **Firebase Cloud Messaging / APNs / Push**: un módulo de infraestructura
  futuro leerá `Notification` y la entregará al dispositivo, referenciando
  `NotificationId` — sin que este dominio conozca tokens ni dispositivos.
- **Email / SMS**: canales de entrega alternativos que consumirán
  `Notification` como fuente de contenido (`title`/`body`), sin acoplarse a
  este módulo.
- **WebSockets**: un canal en tiempo real podrá emitir `Notification` a
  clientes conectados, referenciando `NotificationId`.
- **RabbitMQ / Kafka**: colas de mensajería futuras podrán transportar
  `Notification` entre servicios, sin que el dominio sepa que existen.

En todos los casos, `Notification` es la fuente de datos — nunca depende de
esos mecanismos de entrega.

## Qué NO contiene

FCM Token, Device, Firebase, Email, SMS, Push, canales, prioridades,
WebSockets, RabbitMQ, Kafka, programación de envío, IA, APIs, controladores,
DTOs, casos de uso, servicios de aplicación, persistencia.

## Estructura

```
notification/
  README.md
  domain/
    entities/
      notification.entity.ts
    value-objects/
      notification-id.value-object.ts
      notification-status.value-object.ts
      notification-type.value-object.ts
    interfaces/
      notification-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Notification` únicamente referencia `IdentityId` (de `identity`) — nunca
importa esa entidad completa. `Identity` no conoce `Notification`.
