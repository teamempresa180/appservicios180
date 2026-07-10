# Reviews

Pantalla de reseñas. **Completamente independiente** de `marketplace`,
`categories`, `search`, `home`, `service_detail`, `provider_profile`,
`request_service`, `quote`, `payments`, `chat` y `notifications`: su
propio repositorio, sus propios datos mock, sin ninguna importación
cruzada entre features (solo `orders` importa la **página** de este
feature para poder abrirla, ver más abajo). No tiene `Scaffold` propio
— está preparada para insertarse dentro del flujo de navegación
existente más adelante, igual que el resto de los features de esta
serie. Reutiliza exclusivamente el Design System existente. Sin
identidad visual propia: sin logo, sin colores de marca, sin
tipografía corporativa, sin assets finales, sin ilustraciones ni
imágenes reales — solo Material Icons. El Sprint de Branding sigue
pendiente y **comenzará únicamente cuando este prompt quede
aprobado**.

## Arquitectura

```
reviews/
├── README.md
├── mock/
│   └── mock_reviews_data.dart        Seed: 4 Review/Order/Service reales (un proveedor compartido) + usuario/isOwnReview/canEdit simulados
├── models/
│   └── review_display.dart           Review + Provider + Profile + Order + Service + reviewerName/isOwnReview/canEdit simulados
├── repositories/
│   ├── reviews_repository.dart       Contrato: List<Review>, Provider/Profile/Order/Service "for" un Review
│   └── mock_reviews_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── reviews_page.dart
    └── widgets/
        ├── reviews_header.dart
        ├── reviews_summary.dart
        ├── review_card.dart
        ├── review_rating.dart
        ├── review_comment.dart
        ├── review_filters.dart
        ├── review_actions.dart
        ├── reviews_loading.dart
        └── reviews_empty_state.dart

test/features/reviews/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 4 `Review` reales y deterministas, prefijadas
  `reviews-`, con calificaciones distintas (5/4/3/1 estrellas),
  compartiendo un único `Provider`/`Profile` ("Diana") por simplicidad
  — este feature muestra una **lista fija**, no hay lookup por ID
  todavía.
- **`repositories/`**: `ReviewsRepository` (contrato) +
  `MockReviewsRepository`, que devuelven **únicamente entidades reales
  del dominio** — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `ReviewDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `ReviewsPage` es el único lugar
  que instancia el repositorio y arma la lista de `ReviewDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `review`, `provider`, `profile`, `order`, `service` | Entidades **reales** del dominio (`review/`, `provider/`, `profiles/`, `order/`, `service/`), servidas por el repositorio **mock** (`MockReviewsRepository`, datos fijos en memoria). |
| Calificación, comentario, título | **Reales, no fabricados**: passthrough directo de `Review.rating`/`Review.comment`/`Review.title`, mostrados por `ReviewRatingStars`/`ReviewComment`. |
| `formattedDate` | **Derivado**, no simulado: calculado a partir del `Review.createdAt` real — mismo criterio ya documentado en `OrderDisplay.scheduledDate`, `PaymentDisplay.paymentDate` y `NotificationDisplay.timeAgo`. |
| `reviewerName` | **Totalmente simulado**: `Review` (dominio) solo referencia a quien escribió la reseña por `reviewerIdentityId` (un ID, siguiendo la regla de oro DDD de referenciar otros módulos solo por ID) — nunca se compone un `Profile` del reviewer en este feature (solo el del proveedor, vía `profile`). Por eso "Usuario" en la tarjeta es una etiqueta genérica ("Cliente verificado"), no un nombre real. |
| `isOwnReview`, `canEdit` | **Totalmente simulados**: no existe todavía ningún concepto de sesión/autenticación que permita saber cuál identidad es la del usuario actual, así que "es mi reseña" no puede derivarse de nada real todavía. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ReviewDisplay`.

**Sin colores ni iconos en el modelo**: `ReviewDisplay` no almacena
ningún `Color` ni `IconData`. `ReviewRatingStars` resuelve las
estrellas y su color desde `Review.rating` + `context.colors.*` (la
paleta neutra del tema); `ReviewActions` resuelve su label desde
`canEdit` — nunca un literal suelto, siguiendo la misma regla ya
aplicada en `OrderStatusBadge`/`PaymentStatusBadge`/
`NotificationIcon`.

## Filtros (`ReviewFilters`)

Los 6 filtros ("Todas"/"5★"/"4★"/"3★"/"2★"/"1★") son **puramente
visuales**: mantienen el filtro seleccionado en estado local de Flutter
(mismo patrón que `OrderStatusTabs`/`NotificationFilterTabs`), pero
**no filtran** la lista de reseñas — las 4 reseñas mock se muestran
siempre, sin importar el filtro activo. Intencional: no existe todavía
lógica real de filtrado por calificación.

## Estados visuales

`ReviewsPage` acepta un parámetro fijo `state` (`ReviewsViewState`:
`loading`/`empty`/`list`) — mismo patrón que `SearchPage.state`/
`OrdersPage.state`/`PaymentsPage.state`/`ChatPage.state`/
`NotificationsPage.state` — para poder previsualizar cada estado en
tests, sin ninguna llamada asíncrona real detrás. Por defecto renderiza
`list` con las 4 reseñas mock.

## Cómo conectar posteriormente

### Con Backend

`ReviewsRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiReviewsRepository implements ReviewsRepository` (o
   `FirebaseReviewsRepository`) en `repositories/`, implementando cada
   método con una llamada HTTP real.
2. En `ReviewsPage`, cambiar `MockReviewsRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red), de que `ReviewFilters` filtre realmente la
   lista por calificación, y de que exista una sesión real para derivar
   `isOwnReview`/`canEdit` en vez de simularlos.
4. `reviewerName` se conectaría a un futuro endpoint que sí exponga el
   `Profile` (o nombre) del reviewer, no solo su `reviewerIdentityId`.

### Con Orders

Cada `ReviewDisplay.order` ya es la `Order` real completada que motivó
la reseña (`Review.orderId`). Cuando exista lookup por ID en `orders`,
`ReviewActions` (botón "Ver detalle" para reseñas no editables)
navegaría a esa orden específica en vez de ser un no-op.

### Con Provider Profile

`ReviewDisplay.provider`/`profile` son el mismo proveedor que
`provider_profile` ya muestra con sus propias reseñas
(`ProviderReviewsSummary`). Cuando exista lookup por ID compartido,
tocar el nombre del proveedor en una tarjeta de reseña podría abrir su
`ProviderProfilePage` — hoy no navega a ningún lado.

### Con Notifications

Ninguna reseña nueva dispara una notificación in-app todavía —
`Notification` no se importa en este feature. Cuando exista, el envío
de una reseña sería un disparador natural (p. ej. "Diana Restrepo
respondió a tu reseña"), similar al emparejamiento mock ya usado en
`notifications` entre una `Notification` y su entidad relacionada.

### Con Audit

Ningún envío o edición de reseña se registra en una bitácora de
auditoría todavía — `Audit` (módulo de dominio ya existente) no se
importa en este feature. Cuando exista lógica de negocio real, cada
transición de `ReviewStatus` (o cada edición vía "Editar") sería
candidata a generar un registro de `Audit`.

## Cambio mínimo en Orders

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`orders/presentation/widgets/order_actions.dart`, el botón "Calificar"
(estado `completed`, antes no-op) ahora navega con `Navigator.push` a
`ReviewsPage` envuelta en un `Scaffold` simple con `AppBar` (ya que
`ReviewsPage` no construye su propio `Scaffold`) — el mismo patrón que
`orders` usó para abrirse desde `quote`. Los otros tres botones
("Ver cotización"/"Ver detalle"/"Ver información") no fueron
modificados. Ninguna otra navegación fue modificada.

A diferencia de los prompts anteriores, este especificó explícitamente
qué botón usar ("Calificar"), así que no hubo ambigüedad que resolver.

## Qué widgets son reutilizables

- **`ReviewRatingStars`**: genérico (recibe `Review`), reutilizable en
  cualquier pantalla futura que necesite mostrar una calificación de 5
  estrellas.
- **`ReviewComment`**, **`ReviewsSummary`**: específicos de este
  feature (reciben `ReviewDisplay`/`List<ReviewDisplay>`), pero con
  estructura consistente con el resto de la app.
- **`ReviewActions`**: botón único cuyo label depende de `canEdit` —
  mismo patrón que `OrderActions`/`PaymentActions`/
  `NotificationActions`.
- **`ReviewsEmptyState`**, **`ReviewsLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, Firebase, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, filtrado real
por calificación (filtros puramente visuales), sesión/autenticación
real (de ahí que `isOwnReview`/`canEdit` sean simulados), edición real
de una reseña, notificaciones, auditoría, lookup por ID (una reseña
individual). Los botones "Editar"/"Ver detalle" no hacen nada más que
existir visualmente. Todo el contenido mostrado (excepto las 5
entidades de dominio compuestas y `formattedDate` derivado) es
simulado, como se detalla arriba.
