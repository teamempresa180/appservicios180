# Chat Module (Flutter)

## Qué representa

`chat` modela únicamente la conversación entre un cliente y un proveedor
asociada a una orden: quién participa, de qué orden se trata, su tipo y
estado.

## Diferencia entre Chat y Message

`Chat` es el contenedor de la conversación. `Message` (módulo futuro)
representará cada mensaje individual dentro de un `Chat`. `Chat` nunca
almacena mensajes.

## Diferencia entre Chat y Notification

`Notification` es un aviso unidireccional del sistema. `Chat` es una
conversación bidireccional entre un cliente y un proveedor.

## Por qué Chat solo referencia IDs

`Chat` importa únicamente `OrderId`, `IdentityId` y `ProviderId` — nunca las
entidades completas.

## Cómo permitirá conectar posteriormente Message, Attachment, WebSockets, Push Notifications, IA, Traducción, Moderación sin modificar este dominio

Todos esos módulos futuros referenciarán `ChatId` desde su propio dominio —
`Chat` nunca necesita conocerlos ni cambiar para soportarlos.

## Qué NO contiene

Mensajes, archivos, imágenes, llamadas, videollamadas, sockets,
notificaciones, IA, traducciones, moderación, historial de lectura,
participantes adicionales, persistencia, widgets/pantallas.

## Estructura

```
chat/
  README.md
  models/
    chat_id.dart
    chat_status.dart
    chat_type.dart
  entities/
    chat.dart
```

## Relaciones

`Chat` únicamente referencia `OrderId` (de `order`), `IdentityId` (de
`identity`) y `ProviderId` (de `provider`). Ninguno de esos módulos conoce
`Chat`.
