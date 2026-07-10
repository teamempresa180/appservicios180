# Chat

Pantalla de conversación entre cliente y proveedor. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders` y `payments`: su propio repositorio, sus propios datos mock,
sin ninguna importación cruzada entre features (solo `payments` importa
la **página** de este feature para poder abrirla, ver más abajo). No
tiene `Scaffold` propio — está preparada para insertarse dentro del
flujo de navegación existente más adelante, igual que el resto de los
features de esta serie. Reutiliza exclusivamente el Design System
existente. Sin identidad visual propia: sin logo, sin colores de marca,
sin tipografía corporativa, sin assets finales, sin ilustraciones ni
imágenes reales — solo Material Icons. El Sprint de Branding sigue
pendiente (Prompt 33.1).

## Arquitectura

```
chat/
├── README.md
├── mock/
│   └── mock_chat_data.dart        Seed: Provider/Profile/Order/Chat/Message[]/Attachment[] reales + presencia/typing simulados
├── models/
│   └── chat_display.dart          Chat + Provider + Profile + Order + List<Message> + List<Attachment> + presencia/typing simulados
├── repositories/
│   ├── chat_repository.dart       Contrato: Chat, Provider, Profile, Order, List<Message>, List<Attachment>
│   └── mock_chat_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── chat_page.dart
    └── widgets/
        ├── chat_header.dart
        ├── provider_header.dart
        ├── chat_messages.dart
        ├── message_bubble.dart
        ├── attachment_preview.dart
        ├── typing_indicator.dart
        ├── message_input.dart
        ├── chat_actions.dart
        ├── chat_loading.dart
        └── chat_empty_state.dart

test/features/chat/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Provider`, `Profile`, `Order`, `Chat`, `List<Message>`,
  `List<Attachment>`) con IDs fijos y deterministas, prefijados `chat-`
  — este feature muestra **una sola conversación fija**, no hay lookup
  por ID todavía.
- **`repositories/`**: `ChatRepository` (contrato) +
  `MockChatRepository`, que devuelven **únicamente entidades reales del
  dominio** — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `ChatDisplay`, la única composición de presentación de
  este feature.
- **`presentation/`**: widgets puros; `ChatPage` es el único lugar que
  instancia el repositorio y arma `ChatDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `chat`, `provider`, `profile`, `order`, `messages`, `attachments` | Entidades **reales** del dominio (`chat/`, `provider/`, `profiles/`, `order/`, `message/`, `attachment/`), servidas por el repositorio **mock** (`MockChatRepository`, datos fijos en memoria). |
| Remitente de cada mensaje (proveedor vs. cliente) | **Derivado, no simulado**: `ChatDisplay.isFromProvider(message)` compara `Message.senderIdentityId` con `Provider.identityId` — ambos campos reales del dominio. No se agregó ningún campo `isProvider` simulado a `Message`. |
| Adjuntos de cada mensaje | **Derivado, no simulado**: `ChatDisplay.attachmentsFor(message)` filtra `attachments` por `Attachment.messageId` — ambos campos reales del dominio. |
| `isOnline`, `lastSeen` | **Totalmente simulados**: `Chat`/`Message` son "pure data holders" sin transporte en tiempo real (ver el doc de esas clases en el dominio) — no existe ningún módulo de presencia. |
| `isTyping` | **Totalmente simulado**: misma razón — no hay transporte en tiempo real que reporte un estado de "escribiendo" en vivo. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ChatDisplay`.

### Historial: `Attachment` como extensión planeada, no un feature nuevo

Una auditoría completa del dominio (sesión del Prompt 51) identificó a
`Attachment` como el único módulo de los 23 sin ninguna representación
visual en ningún feature. `Attachment` únicamente referencia
`MessageId` — nunca `Chat` — por lo que pertenece claramente al mismo
bounded context Communication que este feature. Se evaluó crear un
feature `attachment` independiente y se descartó: hubiera requerido
duplicar la navegación y gran parte de la estructura visual de `chat`
sin aportar separación de responsabilidades real. Se extendió `chat` en
su lugar — `ChatDisplay`/`ChatRepository`/`MessageBubble` ganaron el
campo/método/widget nuevos (`attachments`, `attachmentsFor`,
`AttachmentPreview`), sin ningún cambio de navegación.

**Sin colores en el modelo**: `ChatDisplay` no almacena ningún `Color`.
`MessageBubble`/`TypingIndicator`/`ProviderHeader` resuelven todos sus
colores desde `context.colors.*` (la paleta neutra del tema) en tiempo
de construcción — nunca un literal de color suelto, siguiendo la misma
regla ya aplicada en `OrderStatusBadge`/`PaymentStatusBadge`.

## Conversación simulada

`mockChatMessages` alterna Proveedor → Cliente → Proveedor → Cliente
(4 mensajes), usando únicamente entidades `Message` reales con
`senderIdentityId` fijo y determinista. `ChatMessages` recorre la lista
en orden y delega en `MessageBubble` + `ChatDisplay.isFromProvider` para
decidir alineación (izquierda proveedor, derecha cliente) y color.

## Estados visuales

`ChatPage` acepta un parámetro fijo `state` (`ChatViewState`:
`loading`/`empty`/`conversation`) — igual que `SearchPage.state`,
`OrdersPage.state` y `PaymentsPage.state` — para poder previsualizar
cada estado en tests, sin ninguna llamada asíncrona real detrás. Por
defecto renderiza `conversation` con los 4 mensajes mock.

## Input de mensaje

`MessageInput` se ve completamente funcional: el `AppTextField` acepta
escritura libre (estado local de `TextEditingController`, sin
persistencia). El botón "Enviar" (`IconButton.filled`) es un **no-op**
explícito — no agrega el mensaje a `ChatMessages`, no llama a ningún
repositorio, no hay backend/sockets/Firebase/HTTP detrás. Ver la
sección "Qué NO existe todavía" más abajo.

## Cómo conectar posteriormente

### Con Backend

`ChatRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiChatRepository implements ChatRepository` (o
   `FirebaseChatRepository`, si se opta por Firestore/Realtime Database
   para mensajería) en `repositories/`, implementando cada método con
   una llamada HTTP o un stream real.
2. En `ChatPage`, cambiar `MockChatRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   mensajes en vivo, loading/error de red) y de que `MessageInput`
   dispare un envío real en vez de ser un no-op.
4. `isOnline`/`lastSeen`/`isTyping` se conectarían a un futuro canal de
   presencia en tiempo real (WebSockets o equivalente) — hoy no existe.

### Con Notifications

Ningún mensaje nuevo dispara una notificación in-app todavía —
`Notification` (módulo de dominio ya existente) no se importa en este
feature. Cuando exista, un mensaje entrante del proveedor sería el
disparador natural.

### Con Orders

`ChatDisplay.order` ya es el `Order` real asociado a esta conversación
(`Chat.orderId`). `ChatActions` incluye un botón "Ver orden" (hoy
no-op) que, cuando exista lookup por ID en `orders`, navegaría a la
`OrdersPage`/detalle de esa orden específica.

### Con Audit

Ningún envío o cambio de estado de mensaje (enviado/entregado/leído) se
registra en una bitácora de auditoría todavía — `Audit` (módulo de
dominio ya existente) no se importa en este feature. Cuando exista
lógica de negocio real, cada transición de `MessageStatus` sería
candidata a generar un registro de `Audit`.

### Con Push Notifications

No existe ninguna integración de notificaciones push (FCM/APNs) que
avise de un mensaje nuevo mientras la app está en segundo plano. Ese
sería un consumidor externo de los mismos eventos que alimentarían la
integración con `Notifications` arriba, no algo que este feature
implemente directamente.

## Cambio mínimo en Payments

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`payments/presentation/widgets/payment_actions.dart`, el botón "Ver
recibo" (estado `completed`, antes no-op) ahora navega con
`Navigator.push` a `ChatPage` envuelta en un `Scaffold` simple con
`AppBar` (ya que `ChatPage` no construye su propio `Scaffold`) — el
mismo patrón que `payments` usó para abrirse desde `orders`. Los otros
tres botones ("Pagar"/"Intentar nuevamente"/"Ver información") siguen
siendo no-op. Ninguna otra navegación fue modificada.

**Por qué "Ver recibo" y no otro botón**: el prompt no especificó cuál
de los cuatro botones de `PaymentActions` es "el correspondiente" para
abrir Chat. Se eligió "Ver recibo" (pago completado) porque revisar un
recibo es, semánticamente, un momento natural para que el cliente
contacte al proveedor — es una decisión documentada, no una ambigüedad
sin resolver (mismo enfoque que la elección de "Ver detalle" en
`orders` para abrir `payments`).

## Qué widgets son reutilizables

- **`ProviderHeader`**: recap de proveedor con estado en línea,
  reutilizable en cualquier pantalla futura que necesite ese mismo
  encabezado de contacto.
- **`MessageBubble`**: genérico (recibe `Message` + `bool
  isFromProvider` + `List<Attachment>` opcional), reutilizable en
  cualquier lista de mensajes futura.
- **`AttachmentPreview`**: genérico (recibe un `Attachment` + el color
  de texto de la burbuja), reutilizable en cualquier lista de adjuntos
  futura.
- **`TypingIndicator`**: genérico, sin dependencias de `ChatDisplay`.
- **`MessageInput`**: envoltorio de campo de texto + botón de envío,
  reutilizable donde se necesite ese mismo compositor.
- **`ChatEmptyState`**, **`ChatLoading`**: envoltorios delgados sobre
  `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten esos
  estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, sockets, WebSockets, Firebase, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, envío real de
mensajes, presencia/typing en tiempo real, notificaciones push,
auditoría, subida/descarga real de archivos adjuntos, lookup por ID
(una única conversación fija). El botón "Enviar" no hace nada más que
existir visualmente — no agrega mensajes a la lista ni los envía a
ningún lado. El botón "Ver orden" en `ChatActions` sigue siendo no-op.
Todo el contenido mostrado (excepto las 6 entidades de dominio
compuestas y las derivaciones reales de remitente/adjuntos) es
simulado, como se detalla arriba.

**Actualización (feature `notifications`)**: el botón "Más opciones"
(ícono de overflow) en `ChatActions` ya no es un no-op — ahora navega
(vía `Navigator.push`, no `GoRouter`) a `NotificationsPage`, el único
cambio permitido en este feature para ese prompt. Ver el README de
`features/notifications/` para más contexto y para por qué se eligió
ese botón en particular.
