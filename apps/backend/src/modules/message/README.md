# Message Module (Backend)

## Qué representa

`Message` modela un **mensaje individual perteneciente a un Chat**: quién lo
envió, su contenido, tipo, estado y momentos de envío/lectura. Es dominio
puro — solo representa el dato del mensaje, no su transporte.

Campos representados (sin comportamiento, solo datos):

- `MessageId`
- `ChatId` (reutilizado de `chat`)
- `SenderIdentityId` (reutiliza `IdentityId` de `identity`)
- `content`
- `type`
- `status`
- `sentAt`
- `readAt`

A diferencia de otros módulos, `Message` no tiene `updatedAt`: no representa
edición, solo el envío y la lectura.

## Diferencia entre Chat y Message

`Chat` es el contenedor de la conversación (quién habla con quién, sobre qué
orden). `Message` es cada mensaje individual dentro de ese `Chat`. Un `Chat`
puede tener muchos `Message`; un `Message` pertenece exactamente a un `Chat`.

## Diferencia entre Message y Notification

`Notification` es un aviso unidireccional generado por el sistema.
`Message` es contenido enviado por una persona (`SenderIdentityId`) a otra
dentro de una conversación. Son conceptos independientes.

## Por qué Message solo referencia IDs

`Message` importa únicamente `ChatId` e `IdentityId` — nunca las entidades
`Chat` o `Identity` completas. Esto mantiene el dominio de `Message`
desacoplado de los campos internos de esos módulos.

## Cómo permitirá conectar posteriormente Attachment, WebSockets, Push Notifications, IA, Traducción, Moderación, Reacciones, Emojis sin modificar este dominio

- **Attachment**: un módulo futuro que referenciará `MessageId` para
  archivos adjuntos, sin que `Message` necesite campos de archivo.
- **WebSockets**: una capa de infraestructura futura transportará `Message`
  en tiempo real, sin que este dominio conozca sockets.
- **Push Notifications**: referenciará `MessageId` para avisar de nuevos
  mensajes.
- **IA**: podrá analizar `content` como entrada de solo lectura.
- **Traducción**: podrá traducir `content` sin acoplarse a este módulo.
- **Moderación**: referenciará `MessageId` para revisar contenido.
- **Reacciones / Emojis**: un módulo futuro que referenciará `MessageId`
  para asociar reacciones, sin que `Message` tenga campos de reacción.

En todos los casos, `Message` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

Archivos, imágenes, audio, video, ubicación, stickers, emojis, respuestas,
reacciones, edición, eliminación, IA, traducción, moderación, WebSockets,
APIs, controladores, DTOs, casos de uso, servicios de aplicación,
persistencia.

## Estructura

```
message/
  README.md
  domain/
    entities/
      message.entity.ts
    value-objects/
      message-id.value-object.ts
      message-status.value-object.ts
      message-type.value-object.ts
    interfaces/
      message-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Message` únicamente referencia `ChatId` (de `chat`) e `IdentityId` (de
`identity`) — nunca importa esas entidades completas. Ninguno de esos
módulos conoce `Message`.
