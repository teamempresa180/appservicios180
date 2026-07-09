# Message Module (Flutter)

## Qué representa

`message` modela un mensaje individual perteneciente a un `Chat`: quién lo
envió, su contenido, tipo, estado y momentos de envío/lectura. No tiene
`updatedAt` — no representa edición.

## Diferencia entre Chat y Message

`Chat` es el contenedor de la conversación. `Message` es cada mensaje
individual dentro de ese `Chat`.

## Diferencia entre Message y Notification

`Notification` es un aviso unidireccional del sistema. `Message` es
contenido enviado por una persona dentro de una conversación.

## Por qué Message solo referencia IDs

`Message` importa únicamente `ChatId` e `IdentityId` — nunca las entidades
completas.

## Cómo permitirá conectar posteriormente Attachment, WebSockets, Push Notifications, IA, Traducción, Moderación, Reacciones, Emojis sin modificar este dominio

Todos esos módulos futuros referenciarán `MessageId` desde su propio
dominio — `Message` nunca necesita conocerlos ni cambiar.

## Qué NO contiene

Archivos, imágenes, audio, video, ubicación, stickers, emojis, respuestas,
reacciones, edición, eliminación, IA, traducción, moderación, WebSockets,
persistencia, widgets/pantallas.

## Estructura

```
message/
  README.md
  models/
    message_id.dart
    message_status.dart
    message_type.dart
  entities/
    message.dart
```

## Relaciones

`Message` únicamente referencia `ChatId` (de `chat`) e `IdentityId` (de
`identity`). Ninguno de esos módulos conoce `Message`.
