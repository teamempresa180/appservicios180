# Provider Dashboard

Panel de control para la cuenta de proveedor. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications`, `reviews`, `profile`,
`settings` y `address_management`: su propio repositorio, sus propios
datos mock, sin ninguna importación cruzada entre features (solo
`profile` importa la **página** de este feature para poder abrirla,
ver más abajo). No tiene `Scaffold` propio. Reutiliza exclusivamente el
Design System existente. Sin identidad visual propia — solo Material
Icons.

## Arquitectura

```
provider_dashboard/
├── README.md
├── mock/
│   └── mock_provider_dashboard_data.dart   Seed: Provider/Profile/List<Order>/List<Quote>/List<Review>/List<Payment> reales + ganancias/rendimiento simulados
├── models/
│   └── provider_dashboard_display.dart     Provider + Profile + List<Order> + List<Quote> + List<Review> + List<Payment> + campos simulados/derivados
├── repositories/
│   ├── provider_dashboard_repository.dart       Contrato: Provider, Profile, List<Order>, List<Quote>, List<Review>, List<Payment>
│   └── mock_provider_dashboard_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── provider_dashboard_page.dart
    └── widgets/
        ├── dashboard_header.dart
        ├── earnings_summary.dart
        ├── dashboard_statistics.dart
        ├── recent_orders.dart
        ├── pending_requests.dart
        ├── provider_performance.dart
        ├── quick_actions.dart
        ├── dashboard_loading.dart
        └── dashboard_empty_state.dart

test/features/provider_dashboard/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Provider`, `Profile`, 4 `Order` con estados distintos, 2 `Quote`,
  3 `Review`, 2 `Payment`), prefijadas `provider-dashboard-` — este
  feature muestra el panel de **un solo proveedor fijo**, no hay
  lookup por ID todavía.
- **`repositories/`**: `ProviderDashboardRepository` (contrato) +
  `MockProviderDashboardRepository`, que devuelven **únicamente
  entidades reales del dominio** — nunca `Map<String, dynamic>`,
  `dynamic` ni JSON.
- **`models/`**: `ProviderDashboardDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `ProviderDashboardPage` es el
  único lugar que instancia el repositorio y arma
  `ProviderDashboardDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `provider`, `profile`, `orders`, `quotes`, `reviews`, `payments` | Entidades **reales** del dominio (`provider/`, `profiles/`, `order/`, `quote/`, `review/`, `payment/`), servidas por el repositorio **mock** (`MockProviderDashboardRepository`, datos fijos en memoria). |
| `activeOrdersCount`, `completedOrdersCount`, `pendingOrders`/`pendingRequestsCount`, `averageRating` | **Derivados**, no simulados: contados/promediados directamente de las `orders`/`reviews` reales. El prompt los listó como campos simulados ("pendingRequests", "completedServices"), pero aquí se documenta que son derivables de entidades ya reales — mismo criterio ya usado en `ProviderProfileData.experienceYears`, `QuoteData.subtotal`, `OrderDisplay.scheduledDate` y `AddressDisplay.label`: no se fabricó un segundo número inconsistente. |
| `todayEarnings`, `weeklyEarnings`, `monthlyEarnings` | **Totalmente simulados**: `Payment.amount` existe por pago individual, pero ningún módulo de dominio agrega ganancias por período de calendario (hoy/semana/mes) — esa lógica de agregación no existe todavía. |
| `averageResponseTime` | **Totalmente simulado**: mismo criterio ya usado en `mockProviderProfileResponseTime` (`provider_profile`) — no existe ninguna métrica de mensajería/tiempo real que calcule esto. |
| `acceptanceRate` | **Totalmente simulado**: ningún módulo de dominio rastrea cuántas Quotes/Órdenes aceptó vs. rechazó un proveedor a lo largo del tiempo. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ProviderDashboardDisplay`.

**Sin colores ni iconos en el modelo**: `ProviderDashboardDisplay` no
almacena ningún `Color` ni `IconData` — todos los widgets resuelven
ambos desde `context.colors.*`/`Icons.*` en tiempo de construcción.

## Estados visuales

`ProviderDashboardPage` acepta un parámetro fijo `state`
(`ProviderDashboardViewState`: `loading`/`empty`/`information`) — mismo
patrón que el resto de los features desde `search`.

## Cómo conectar posteriormente

### Con Orders

`orders` (el campo, no el feature) ya es `List<Order>` real. Cuando
exista lookup por ID compartido entre features, `RecentOrders`/
`PendingRequests` podrían navegar a la orden real correspondiente en
`orders` en vez de solo mostrarla en una lista de solo lectura.

### Con Payments

`payments` ya es `List<Payment>` real, pero `todayEarnings`/
`weeklyEarnings`/`monthlyEarnings` siguen simulados porque agregar
montos reales por período de calendario requiere lógica de negocio que
no existe todavía. Cuando exista, esa agregación reemplazaría los tres
campos simulados, probablemente expuesta por un endpoint de reportes.

### Con Reviews

`reviews` ya es `List<Review>` real y `averageRating` ya se deriva de
ahí. Cuando exista lookup por ID compartido, la sección de
estadísticas podría enlazar a la lista completa de reseñas en
`reviews`.

### Con Availability

Ninguna disponibilidad real se muestra todavía — `Availability`
(módulo de dominio ya existente) no se importa en este feature. El
botón "Disponibilidad" en `QuickActions` es el lugar donde,
eventualmente, se navegaría a una pantalla de gestión de
disponibilidad real.

### Con Backend

`ProviderDashboardRepository` es una interfaz Dart estándar. Para
conectar datos reales:

1. Crear `ApiProviderDashboardRepository implements
   ProviderDashboardRepository` en `repositories/`, implementando cada
   método con una llamada HTTP real (probablemente varios endpoints:
   órdenes, cotizaciones, reseñas, pagos).
2. En `ProviderDashboardPage`, cambiar
   `MockProviderDashboardRepository()` por la nueva implementación —
   es el único punto de construcción, ningún widget cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `QuickActions` dispare navegación
   real en vez de ser no-op.
4. `todayEarnings`/`weeklyEarnings`/`monthlyEarnings`/
   `averageResponseTime`/`acceptanceRate` se conectarían a un futuro
   endpoint de reportes/analítica del proveedor.

## Cambio mínimo en Profile

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`profile/presentation/widgets/profile_actions.dart`, se agregó un
tercer botón "Panel del proveedor" (entre "Editar perfil" y "Cerrar
sesión") que navega con `Navigator.push` a `ProviderDashboardPage`
envuelta en un `Scaffold` simple con `AppBar` (ya que
`ProviderDashboardPage` no construye su propio `Scaffold`) — el mismo
patrón que `settings` usó para abrirse desde `profile`. Ninguna otra
navegación fue modificada.

## Qué widgets son reutilizables

- **`EarningsSummary`**, **`DashboardStatistics`**,
  **`ProviderPerformance`**, **`RecentOrders`**, **`PendingRequests`**:
  específicos de este feature (reciben `ProviderDashboardDisplay`),
  pero con estructura (tarjeta + `AppSectionTitle`) consistente con el
  resto de la app.
- **`QuickActions`**: cuatro botones fijos — reutilizable donde se
  necesite exactamente ese conjunto de CTA.
- **`DashboardEmptyState`**, **`DashboardLoading`**: envoltorios
  delgados sobre `AppEmptyState`/`AppLoading` — reutilizables donde se
  necesiten esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, agregación real
de ganancias por período, métricas reales de tiempo de respuesta/tasa
de aceptación, disponibilidad real, lookup por ID (un único proveedor
fijo). Los botones "Disponibilidad"/"Estadísticas"/"Configuración" de
`QuickActions` siguen sin hacer nada más que existir visualmente. Todo
el contenido mostrado (excepto las 6 entidades de dominio compuestas y
los 4 campos derivados) es simulado, como se detalla arriba.

**Actualización (feature `provider_services`)**: el botón "Ver
servicios" de `QuickActions` ya no es un no-op — ahora navega (vía
`Navigator.push`, no `GoRouter`) a `ProviderServicesPage`, el único
cambio permitido en este feature para ese prompt. Ver el README de
`features/provider_services/` para más contexto.
