# Chat Module (Backend)

## Qué representa

`Chat` modela únicamente la **conversación entre un cliente y un proveedor
asociada a una orden**: quién participa, de qué orden se trata, su tipo y
estado. Es dominio puro — solo representa que la conversación existe, no su
contenido ni su transporte en tiempo real.

Campos representados (sin comportamiento, solo datos):

- `ChatId`
- `OrderId` (reutilizado de `order`)
- `ClientIdentityId` (reutiliza `IdentityId` de `identity`)
- `ProviderId` (reutilizado de `provider`)
- `status`
- `type`
- `createdAt`, `updatedAt`

## Diferencia entre Chat y Message

`Chat` es el contenedor de la conversación (quién habla con quién, sobre qué
orden). `Message` (módulo futuro) representará cada mensaje individual
dentro de un `Chat` — contenido, remitente y momento de envío. `Chat` nunca
almacena mensajes.

## Diferencia entre Chat y Notification

`Notification` es un aviso unidireccional del sistema hacia una `Identity`.
`Chat` es una conversación bidireccional entre un cliente y un proveedor.
Son conceptos independientes que no se relacionan en este dominio.

## Por qué Chat solo referencia IDs

`Chat` importa únicamente `OrderId`, `IdentityId` y `ProviderId` — nunca las
entidades `Order`, `Identity` o `Provider` completas. Esto mantiene el
dominio de `Chat` desacoplado de los campos internos de esos módulos.

## Cómo permitirá conectar posteriormente Message, Attachment, WebSockets, Push Notifications, IA, Traducción, Moderación sin modificar este dominio

- **Message**: un módulo futuro que referenciará `ChatId` para cada mensaje
  individual, sin que `Chat` necesite campos de mensajería.
- **Attachment**: referenciará `ChatId` (o `MessageId`) para archivos
  adjuntos.
- **WebSockets**: una capa de infraestructura futura transportará mensajes
  en tiempo real referenciando `ChatId`, sin que este dominio conozca
  sockets.
- **Push Notifications**: referenciará `ChatId` para avisar de nuevos
  mensajes.
- **IA**: podrá analizar el contenido de los mensajes de un `Chat` como
  entrada de solo lectura (por ejemplo, sugerencias de respuesta).
- **Traducción**: podrá traducir mensajes de un `Chat` sin acoplarse a este
  módulo.
- **Moderación**: referenciará `ChatId`/`MessageId` para revisar contenido.

En todos los casos, `Chat` es referenciado — nunca depende de esos módulos.

## Qué NO contiene

Mensajes, archivos, imágenes, llamadas, videollamadas, sockets,
notificaciones, IA, traducciones, moderación, historial de lectura,
participantes adicionales, APIs, controladores, DTOs, casos de uso,
servicios de aplicación, persistencia.

## Estructura

```
chat/
  README.md
  domain/
    entities/
      chat.entity.ts
    value-objects/
      chat-id.value-object.ts
      chat-status.value-object.ts
      chat-type.value-object.ts
    interfaces/
      chat-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Chat` únicamente referencia `OrderId` (de `order`), `IdentityId` (de
`identity`) y `ProviderId` (de `provider`) — nunca importa esas entidades
completas. Ninguno de esos módulos conoce `Chat`.
