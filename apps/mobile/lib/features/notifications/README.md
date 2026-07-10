# Notifications

Centro de notificaciones. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile`, `request_service`, `quote`, `orders`, `payments` y
`chat`: su propio repositorio, sus propios datos mock, sin ninguna
importación cruzada entre features (solo `chat` importa la **página**
de este feature para poder abrirla, ver más abajo). No tiene
`Scaffold` propio — está preparada para vivir dentro del `AppShell`
(slot "Mensajes"/notificaciones) más adelante, igual que
`home`/`marketplace`/`categories`/`search` ya lo hacen. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin tipografía corporativa, sin assets
finales, sin ilustraciones ni imágenes reales — solo Material Icons. El
Sprint de Branding sigue pendiente (Prompt 33.1).

## Arquitectura

```
notifications/
├── README.md
├── mock/
│   └── mock_notifications_data.dart   Seed: 5 Notification reales (uno por categoría) + Order/Payment/Quote/Chat reales emparejados
├── models/
│   └── notification_display.dart      Notification + Order?/Payment?/Quote?/Chat? + timeAgo derivado
├── repositories/
│   ├── notifications_repository.dart       Contrato: List<Notification>, Order?/Payment?/Quote?/Chat? "for" una Notification
│   └── mock_notifications_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── notifications_page.dart
    └── widgets/
        ├── notifications_header.dart
        ├── notification_filter_tabs.dart
        ├── notifications_list.dart
        ├── notification_card.dart
        ├── notification_icon.dart
        ├── notification_status_badge.dart
        ├── notification_actions.dart
        ├── notifications_loading.dart
        └── notifications_empty_state.dart

test/features/notifications/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 5 `Notification` reales y deterministas, prefijadas
  `notifications-`, una por cada categoría que la UI necesita
  distinguir (orden/pago/cotización/mensaje/sistema), cada una
  emparejada (solo en el mock, ver abajo) con el `Order`/`Payment`/
  `Quote`/`Chat` real correspondiente.
- **`repositories/`**: `NotificationsRepository` (contrato) +
  `MockNotificationsRepository`, que devuelven **únicamente entidades
  reales del dominio** — nunca `Map<String, dynamic>`, `dynamic` ni
  JSON.
- **`models/`**: `NotificationDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `NotificationsPage` es el único
  lugar que instancia el repositorio y arma la lista de
  `NotificationDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `notification` | Entidad **real** del dominio (`notification/`), servida por el repositorio **mock**. |
| `order`, `payment`, `quote`, `chat` | Entidades **reales** del dominio cuando existen — pero la **relación** entre una `Notification` y cualquiera de ellas es **mock-only**: `Notification` (dominio) solo tiene `identityId`, ningún foreign key a `Order`/`Payment`/`Quote`/`Chat` (ver el doc de la clase `Notification`: "no channels, no delivery logic"). El emparejamiento vive únicamente en `mock_notifications_data.dart`, documentado explícitamente como tal. |
| `title`, `description` | **Reales, no fabricados**: passthrough directo de `Notification.title`/`Notification.body`. |
| `category` | **Derivado**: según cuál de `order`/`payment`/`quote`/`chat` no sea nulo (o `system` si ninguno lo es). Un enum de clasificación de UI, no un campo de dominio. |
| `isUnread` | **Derivado**, no simulado: `Notification.status != NotificationStatus.read`. |
| `timeAgo` | **Derivado**, no simulado: calculado aquí mismo a partir del `Notification.createdAt` real contra una referencia fija `mockNotificationsNow` (no hay reloj en vivo) — mismo criterio ya documentado en `OrderDisplay.scheduledDate`/`PaymentDisplay.paymentDate`. |
| `actionLabel` | **Derivado en la UI** a partir de `category` — una etiqueta legible, no un campo almacenado. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `NotificationDisplay`.

**Sin colores ni iconos en el modelo**: `NotificationDisplay` no
almacena ningún `Color` ni `IconData`. `NotificationIcon` resuelve el
icono y el color desde `category` + `context.colors.*` (la paleta
neutra del tema); `NotificationStatusBadge` resuelve su color de la
misma forma — nunca un literal suelto, siguiendo la misma regla ya
aplicada en `OrderStatusBadge`/`PaymentStatusBadge`.

## Tabs de filtro (`NotificationFilterTabs`)

Los 5 tabs ("Todas"/"No leídas"/"Pedidos"/"Pagos"/"Mensajes") son
**puramente visuales**: mantienen el tab seleccionado en estado local
de Flutter (mismo patrón que `OrderStatusTabs` en `orders`), pero **no
filtran `NotificationsList`** — las 5 notificaciones mock se muestran
siempre, sin importar el tab activo. Intencional: no existe todavía
lógica real de filtrado.

## Estados visuales

`NotificationsPage` acepta un parámetro fijo `state`
(`NotificationsViewState`: `loading`/`empty`/`list`) — mismo patrón que
`SearchPage.state`/`OrdersPage.state`/`PaymentsPage.state`/
`ChatPage.state` — para poder previsualizar cada estado en tests, sin
ninguna llamada asíncrona real detrás. Por defecto renderiza `list` con
las 5 notificaciones mock.

## Cómo conectar posteriormente

### Con Backend

`NotificationsRepository` es una interfaz Dart estándar. Para conectar
datos reales:

1. Crear `ApiNotificationsRepository implements NotificationsRepository`
   (o `FirebaseNotificationsRepository`) en `repositories/`,
   implementando cada método con una llamada HTTP o un stream real.
2. En `NotificationsPage`, cambiar `MockNotificationsRepository()` por
   la nueva implementación — es el único punto de construcción, ningún
   widget cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   notificaciones en vivo, loading/error de red) y de que
   `NotificationFilterTabs` filtre realmente `NotificationsList` por
   categoría (hoy es puramente visual).
4. Un backend real probablemente expondría ya el `Order`/`Payment`/
   `Quote`/`Chat` relacionado como parte del payload de la notificación
   (o un endpoint de enriquecimiento), reemplazando el emparejamiento
   mock-only descrito arriba.

### Con Chat

`NotificationActions` muestra "Ver mensaje" para notificaciones de
categoría `chat` (hoy no-op). Cuando exista lookup por ID, navegaría a
`ChatPage` con la conversación real (`NotificationDisplay.chat`).

### Con Orders

`NotificationActions` muestra "Ver orden" para notificaciones de
categoría `order` (hoy no-op). Cuando exista lookup por ID, navegaría a
la orden real (`NotificationDisplay.order`) en `orders`.

### Con Payments

`NotificationActions` muestra "Ver pago" para notificaciones de
categoría `payment` (hoy no-op). Cuando exista lookup por ID, navegaría
al pago real (`NotificationDisplay.payment`) en `payments`.

### Con Push Notifications

No existe ninguna integración de notificaciones push (FCM/APNs/
OneSignal) todavía — este feature solo modela el **centro de
notificaciones in-app**. Cuando exista, un push entrante sería otro
consumidor de los mismos eventos de dominio que alimentan esta lista,
probablemente disparando también la creación de un `Notification` real
vía backend.

### Con Audit

Ningún cambio de estado de una notificación (leída/archivada) se
registra en una bitácora de auditoría todavía — `Audit` (módulo de
dominio ya existente) no se importa en este feature. Cuando exista
lógica de negocio real, cada transición de `NotificationStatus` sería
candidata a generar un registro de `Audit`.

## Cambio mínimo en Chat

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`chat/presentation/widgets/chat_actions.dart`, el botón "Más opciones"
(ícono de overflow `more_vert`, antes no-op) ahora navega con
`Navigator.push` a `NotificationsPage` envuelta en un `Scaffold` simple
con `AppBar` (ya que `NotificationsPage` no construye su propio
`Scaffold`) — el mismo patrón que `chat` usó para abrirse desde
`payments`. El botón "Ver orden" sigue siendo no-op. Ninguna otra
navegación fue modificada.

**Por qué "Más opciones" y no otro botón**: el prompt no especificó
cuál botón de `ChatActions` es "el correspondiente" para abrir
Notifications. Se eligió el ícono de overflow ("Más opciones") porque
un menú de opciones adicionales es, semánticamente, el lugar natural
para llegar al centro de notificaciones — es una decisión documentada,
no una ambigüedad sin resolver (mismo enfoque usado en `orders`→
`payments` y `payments`→`chat`).

## Qué widgets son reutilizables

- **`NotificationIcon`**, **`NotificationStatusBadge`**: genéricos
  (reciben `NotificationDisplay`), reutilizables en cualquier pantalla
  futura que necesite el mismo mapeo de categoría→icono/color.
- **`NotificationCard`**: composición completa de una notificación,
  reutilizable como fila de lista en cualquier pantalla que muestre
  notificaciones.
- **`NotificationActions`**: botón único cuyo label depende de
  `category` — mismo patrón que `OrderActions`/`PaymentActions`.
- **`NotificationsEmptyState`**, **`NotificationsLoading`**:
  envoltorios delgados sobre `AppEmptyState`/`AppLoading` —
  reutilizables donde se necesiten esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, Firebase, FCM, OneSignal, sockets, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, filtrado real
por categoría (tabs puramente visuales), notificaciones push,
auditoría, lookup por ID (una notificación individual). Los botones
"Ver orden"/"Ver pago"/"Ver cotización"/"Ver mensaje"/"Ver más" no
hacen nada más que existir visualmente. Todo el contenido mostrado
(excepto la entidad `Notification` y las entidades relacionadas
reales) es derivado, como se detalla arriba.
