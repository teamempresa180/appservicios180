# Payments

Pantalla de detalle de un pago. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile`, `request_service`, `quote` y `orders`: su propio
repositorio, sus propios datos mock, sin ninguna importación cruzada
entre features (solo `orders` importa la **página** de este feature
para poder abrirla, ver más abajo). No tiene `Scaffold` propio — está
preparada para insertarse dentro del flujo de navegación existente más
adelante, igual que el resto de los features de esta serie. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin tipografía corporativa, sin assets
finales, sin ilustraciones ni imágenes reales — solo Material Icons. El
Sprint de Branding sigue pendiente (Prompt 33.1).

## Arquitectura

```
payments/
├── README.md
├── mock/
│   └── mock_payment_data.dart        Seed: Provider/Profile/Service/Order/Quote/Payment reales + referencia/recibo simulados
├── models/
│   └── payment_display.dart          Payment + Order + Quote + Service + Provider + Profile + referencia/recibo simulados
├── repositories/
│   ├── payments_repository.dart      Contrato: Payment, Order, Quote, Service, Provider, Profile
│   └── mock_payments_repository.dart Implementación en memoria
└── presentation/
    ├── pages/
    │   └── payments_page.dart
    └── widgets/
        ├── payments_header.dart
        ├── payment_information.dart
        ├── payment_method_card.dart
        ├── payment_status_badge.dart
        ├── payment_summary.dart
        ├── payment_breakdown.dart
        ├── payment_actions.dart
        ├── payment_loading.dart
        └── payment_empty_state.dart

test/features/payments/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Provider`, `Profile`, `Service`, `Order`, `Quote`, `Payment`) con
  IDs fijos y deterministas, prefijados `payments-` — este feature
  muestra **un solo pago fijo**, no hay lookup por ID todavía.
- **`repositories/`**: `PaymentsRepository` (contrato) +
  `MockPaymentsRepository`, que devuelven **únicamente entidades reales
  del dominio** — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
  `Category` no se incluyó (el prompt la listaba como opcional "si es
  necesaria"; ninguna pantalla de "Información" pedida la requiere).
- **`models/`**: `PaymentDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `PaymentsPage` es el único lugar
  que instancia el repositorio y arma `PaymentDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `payment`, `order`, `quote`, `service`, `provider`, `profile` | Entidades **reales** del dominio (`payment/`, `order/`, `quote/`, `service/`, `provider/`, `profiles/`), servidas por el repositorio **mock** (`MockPaymentsRepository`, datos fijos en memoria). |
| `paymentMethod` | **Real, no fabricado**: passthrough directo de `Payment.method` (`PaymentMethod`, enum real del dominio). El prompt lo listó como simulado, pero aquí se documenta que es un campo real (mismo criterio ya usado en `ProviderProfileData.experienceYears`, `QuoteData.subtotal` y `OrderDisplay.scheduledDate`) — no se inventó un segundo valor inconsistente. `.label` es la única adición de presentación: un `String` legible, no un campo nuevo del dominio. |
| `paymentDate` | **Real, no fabricado**: passthrough directo de `Payment.createdAt`. El propio prompt permitía "real o derivada" para este campo. |
| `total` | **Real, no fabricado**: passthrough directo de `Payment.amount`. A diferencia de `Quote`, `Payment` modela un único monto sin desglose de subtotal/cargos/impuestos — `PaymentBreakdown` solo presenta ese número real, sin inventar líneas adicionales. |
| `paymentReference`, `receiptNumber` | **Totalmente simulados**: `Payment` es un registro puro sin integración de pasarela de pago ni módulo de facturación/recibos (ver el doc de la clase `Payment` en el dominio) — no existe ningún concepto de referencia de transacción o número de recibo todavía. |
| `statusText` | **Derivado en la UI** a partir de `Payment.status` — una etiqueta legible, no un campo almacenado. |

**Nota sobre `statusColor`** (mismo criterio que `OrderDisplay`): no se
almacena ningún `Color` en `PaymentDisplay`. `PaymentStatusBadge` mapea
`Payment.status` directamente a `context.colors.*` (la paleta neutra
del tema), nunca a un literal de color suelto.

**Nota sobre el estado "Procesando"**: el prompt pidió un botón
"Ver estado" para un estado "Procesando", pero el enum real del dominio
`PaymentStatus` solo tiene `pending`/`completed`/`failed`/`cancelled` —
no existe ningún valor de "procesando en curso". `PaymentActions`
implementa fielmente los 4 estados reales; `cancelled` (no mencionado
por el prompt) reutiliza la etiqueta "Ver información" del mismo patrón
usado en `OrderActions`, ya que tampoco fue especificado. Si el dominio
llegara a modelar un estado intermedio real, este widget sería el único
lugar a actualizar.

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `PaymentDisplay`.

## Estados visuales

`PaymentsPage` acepta un parámetro fijo `state` (`PaymentsViewState`:
`loading`/`empty`/`information`) — igual que `SearchPage.state` y
`OrdersPage.state` — para poder previsualizar cada estado en tests, sin
ninguna llamada asíncrona real detrás. Por defecto renderiza
`information` con el pago mock.

## Cómo conectar posteriormente

### Con Backend

`PaymentsRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiPaymentsRepository implements PaymentsRepository` (o
   `FirebasePaymentsRepository`) en `repositories/`, implementando cada
   método con una llamada HTTP real.
2. En `PaymentsPage`, cambiar `MockPaymentsRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `PaymentActions` dispare un flujo
   real de pasarela de pago en vez de ser un no-op.
4. `paymentReference`/`receiptNumber` se conectarían a un futuro módulo
   de facturación/recibos.

### Con Orders

Hoy `PaymentsRepository` sirve un `Payment`/`Order` fijos del mismo
mock, no el `Order` real sobre el que se tocó "Ver detalle" en
`orders`. Cuando exista lookup por ID, `OrdersRepository`/
`PaymentsRepository` deberían poder relacionar un pago con su orden
real vía `Payment.orderId`/`Order.id` (campo que ya existe en el
dominio).

### Con Notifications

Ningún evento de pago (pago recibido, pago fallido) dispara una
notificación todavía — `Notification` no se importa en este feature.
Cuando exista, probablemente se dispare desde el punto donde hoy
`PaymentActions` es un no-op.

### Con Chat

No existe ningún acceso directo desde Payments hacia un chat con el
proveedor todavía. Si se necesita (p. ej. para disputar un pago
fallido), sería un botón adicional en `PaymentActions` o
`PaymentInformation`.

### Con Audit

Ningún cambio de estado de pago se registra en una bitácora de
auditoría todavía — `Audit` (módulo de dominio ya existente) no se
importa en este feature. Cuando exista lógica de negocio real, cada
transición de `PaymentStatus` sería candidata a generar un registro de
`Audit`.

## Cambio mínimo en Orders

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`orders/presentation/widgets/order_actions.dart`, el botón "Ver
detalle" (estados `accepted`/`inProgress`, antes no-op) ahora navega
con `Navigator.push` a `PaymentsPage` envuelta en un `Scaffold` simple
con `AppBar` (ya que `PaymentsPage` no construye su propio `Scaffold`)
— el mismo patrón que `orders` usó para abrirse desde `quote`. Los
otros tres botones ("Ver cotización"/"Calificar"/"Ver información")
siguen siendo no-op. Ninguna otra navegación fue modificada.

**Por qué "Ver detalle" y no otro botón**: el prompt no especificó cuál
de los cuatro botones de `OrderActions` es "el correspondiente" para
abrir Payments. Se eligió "Ver detalle" (orden en curso) por ser,
semánticamente, el lugar donde revisar/realizar el pago de una orden
activa encaja mejor — es una decisión documentada, no una ambigüedad
sin resolver.

## Qué widgets son reutilizables

- **`PaymentMethodCard`**, **`PaymentStatusBadge`**, **`PaymentSummary`**,
  **`PaymentBreakdown`**: específicos de este feature (reciben
  `PaymentDisplay`), pero con una estructura interna (tarjeta +
  `AppSectionTitle`) consistente con el resto de la app.
- **`PaymentActions`**: botón único cuyo label depende de
  `Payment.status` — mismo patrón que `OrderActions`.
- **`PaymentEmptyState`**, **`PaymentLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, Firebase, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, procesamiento
real de pagos (pasarela/gateway), notificaciones, auditoría, lookup por
ID (un único pago fijo). Los botones
"Pagar"/"Intentar nuevamente"/"Ver información" siguen sin hacer nada
más que existir visualmente. Todo el contenido mostrado (excepto las 6
entidades de dominio compuestas y los 3 campos reales expuestos con
otro nombre) es simulado o derivado, como se detalla arriba.

**Actualización (feature `chat`)**: el botón "Ver recibo" (estado
`completed`) ya no es un no-op — ahora navega (vía `Navigator.push`, no
`GoRouter`) a `ChatPage`, el único cambio permitido en este feature
para ese prompt. Ver el README de `features/chat/` para más contexto y
para por qué se eligió ese botón en particular.
