# Orders

Pantalla de historial de órdenes del cliente. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service` y `quote`: su
propio repositorio, sus propios datos mock, sin ninguna importación
cruzada entre features (solo `quote` importa la **página** de este
feature para poder abrirla, ver más abajo). No tiene `Scaffold` propio
— está preparada para vivir dentro del `AppShell` (slot "Órdenes") más
adelante, igual que `home`/`marketplace`/`categories`/`search` ya lo
hacen. Reutiliza exclusivamente el Design System existente. Sin
identidad visual propia: sin logo, sin colores de marca, sin
tipografía corporativa, sin assets finales, sin ilustraciones ni
imágenes reales — solo Material Icons. El Sprint de Branding sigue
pendiente (Prompt 33.1).

A diferencia de todos los features anteriores, este es el primero que
muestra una **lista** de registros (varias órdenes simuladas) en vez de
un único registro fijo, y el primero con tres estados visuales
completos (loading/empty/list) más un selector de tabs — mismo patrón
de `state` fijo (sin gestión de estado real) que `search` ya usa para
sus cuatro estados.

## Arquitectura

```
orders/
├── README.md
├── mock/
│   └── mock_orders_data.dart        Seed: 4 Order/Service/Category/Quote reales (uno por estado) + estimatedArrival simulado
├── models/
│   └── order_display.dart           Order + Service + Provider + Profile + Category + Quote + estimatedArrival simulado
├── repositories/
│   ├── orders_repository.dart       Contrato: List<Order>, Service/Provider/Profile/Category/Quote "for" un Order
│   └── mock_orders_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── orders_page.dart
    └── widgets/
        ├── orders_header.dart
        ├── order_status_tabs.dart
        ├── orders_list.dart
        ├── order_card.dart
        ├── order_status_badge.dart
        ├── order_summary.dart
        ├── order_actions.dart
        ├── order_empty_state.dart
        └── order_loading.dart

test/features/orders/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 4 conjuntos de entidades reales del dominio (`Order`,
  `Service`, `Category`, `Quote`), uno por cada `OrderStatus` que la UI
  necesita distinguir (`pending`/`inProgress`/`completed`/`cancelled`),
  compartiendo un único `Provider`/`Profile` ("Diana") por simplicidad.
  IDs fijos y deterministas, prefijados `orders-`.
- **`repositories/`**: `OrdersRepository` (contrato) +
  `MockOrdersRepository`, que devuelven **únicamente entidades reales
  del dominio** — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `OrderDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `OrdersPage` es el único lugar
  que instancia el repositorio y arma la lista de `OrderDisplay`.

## Qué es real, derivado o simulado en `OrderDisplay`

| Campo | Origen |
|---|---|
| `order`, `service`, `provider`, `profile`, `category`, `quote` | Entidades **reales** del dominio, vía el repositorio. |
| `scheduledDate` | **Real, no fabricado**: passthrough directo de `Order.scheduledDate` (campo real del dominio), expuesto con el nombre que pidió la UI. El prompt lo listó como simulado, pero aquí se documenta que es un campo real (mismo criterio ya usado en `ProviderProfileData.experienceYears` y `QuoteData.subtotal`) — no se inventó un segundo valor inconsistente. `OrderSummary` renderiza su fecha y hora por separado. |
| `price` | **Real, no fabricado**: passthrough directo de `Quote.proposedPrice`. Mismo criterio que `scheduledDate`. |
| `estimatedArrival` | **Simulado**: no existe ningún módulo de tracking/logística en el dominio que calcule una llegada estimada en vivo. |
| `statusText` | **Derivado en la UI** a partir de `Order.status` — una etiqueta legible, no un campo almacenado. |

**Nota sobre `statusColor`**: el prompt pidió un campo `statusColor` en
el modelo. Esta implementación **no almacena ningún `Color`** en
`OrderDisplay` — resolver un color a partir de un estado es
responsabilidad del Design System, no del modelo. `OrderStatusBadge`
mapea `Order.status` directamente a `context.colors.*` (la paleta
neutra del tema), nunca a un literal de color suelto, siguiendo la
regla del proyecto de que solo `core/ui` define colores. Ver
`order_status_badge.dart`.

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `OrderDisplay`.

## Estados visuales

`OrdersPage` acepta un parámetro fijo `state` (`OrdersViewState`:
`loading`/`empty`/`list`) — igual que `SearchPage.state` — para poder
previsualizar cada estado en tests, sin ninguna llamada asíncrona real
detrás. Por defecto renderiza `list` con las 4 órdenes mock.

## Tabs de estado (`OrderStatusTabs`)

Los 4 tabs ("Pendientes"/"En progreso"/"Finalizadas"/"Canceladas") son
**puramente visuales**: `OrderStatusTabs` mantiene el tab seleccionado
en estado local de Flutter (como `PrioritySelector` en
`request_service`), pero **no filtra `OrdersList`** — la lista completa
de 4 órdenes se muestra siempre, sin importar el tab activo. Esto es
intencional: no existe todavía lógica real de filtrado por estado.

## Cómo conectar posteriormente

### Con Backend

`OrdersRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiOrdersRepository implements OrdersRepository` (o
   `FirebaseOrdersRepository`) en `repositories/`, implementando cada
   método con una llamada HTTP real.
2. En `OrdersPage`, cambiar `MockOrdersRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `OrderStatusTabs` filtre realmente
   `OrdersList` por estado (hoy es puramente visual).
4. `estimatedArrival` se conectaría a un futuro módulo de
   tracking/logística.

### Con Quote

Hoy cada `OrderDisplay` trae una `Quote` fija del mismo mock (no la
`Quote` real generada en el flujo `request_service` → `quote`). Cuando
exista creación real de `Order`, "Confirmar solicitud" en `quote`
debería crear una `Order` a partir de esa `Quote` específica (hoy es
un no-op que solo navega, ver más abajo) y `OrdersRepository` debería
poder buscar la `Quote` real asociada a cada `Order` por `QuoteId`.

### Con Payment

`OrderDisplay` sigue sin componer `Payment` directamente — `Payment`
no se importa en este feature. Cuando exista lookup real, se agregaría
como otro campo real compuesto en `OrderDisplay` (p. ej. un
`PaymentStatus` derivado), mostrado junto al precio en `OrderSummary`.

**Actualización (feature `payments`)**: el botón "Ver detalle" (estados
`accepted`/`inProgress`) ya no es un no-op — ahora navega (vía
`Navigator.push`, no `GoRouter`) a `PaymentsPage`, el único cambio
permitido en este feature para ese prompt. Ver el README de
`features/payments/` para más contexto y para por qué se eligió ese
botón en particular.

### Con Chat

El botón "Ver detalle" (estado `inProgress`/`accepted`) es donde
probablemente se abra en el futuro tanto el detalle de la orden como
un acceso directo al `Chat` con el proveedor — hoy es un no-op.

## Cambio mínimo en Quote

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`quote/presentation/widgets/confirm_quote_button.dart`, el botón
"Confirmar solicitud" (antes no-op) ahora navega con `Navigator.push` a
`OrdersPage` envuelta en un `Scaffold` simple con `AppBar` (ya que
`OrdersPage` no construye su propio `Scaffold`) — el mismo patrón que
`quote` usó para abrirse desde `request_service`. Ninguna otra
navegación fue modificada.

## Qué widgets son reutilizables

- **`OrderStatusBadge`**: genérico (recibe `OrderDisplay`), reutilizable
  en cualquier pantalla futura que necesite mostrar el estado de una
  orden con el mismo mapeo de colores.
- **`OrderSummary`**: recap genérico de servicio/proveedor/fecha/precio,
  reutilizable donde se necesite ese mismo resumen.
- **`OrderActions`**: botón único cuyo label depende de `Order.status`
  — reutilizable donde se necesite ese mismo CTA dinámico.
- **`OrderCard`**: composición de los tres anteriores dentro de
  `AppCard` — reutilizable como fila de lista en cualquier pantalla que
  muestre órdenes.
- **`OrderEmptyState`**, **`OrderLoading`**: envoltorios delgados sobre
  `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten esos
  estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, Firebase, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, filtrado real
por estado (tabs puramente visuales), creación real de `Order` a
partir de una `Quote`, `Payment`/`Chat`/`Review` compuestos
directamente en `OrderDisplay`, notificaciones, lookup por ID de una
orden individual (detalle de orden), tracking/logística real. El botón
"Ver cotización" sigue sin hacer nada más que existir visualmente.
Todo el contenido mostrado (excepto las 6 entidades de dominio
compuestas y los 2 campos reales expuestos con otro nombre) es
simulado o derivado, como se detalla arriba.

**Actualización (feature `reviews`)**: el botón "Calificar" (estado
`completed`) ya no es un no-op — ahora navega (vía `Navigator.push`, no
`GoRouter`) a `ReviewsPage`, el único cambio permitido en este feature
para ese prompt (el prompt especificó explícitamente este botón, sin
ambigüedad). Ver el README de `features/reviews/` para más contexto.
