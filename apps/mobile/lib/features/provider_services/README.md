# Provider Services

Pantalla de administración de los servicios publicados por un
proveedor. **Completamente independiente** de `marketplace`,
`categories`, `search`, `home`, `service_detail`, `provider_profile`,
`request_service`, `quote`, `orders`, `payments`, `chat`,
`notifications`, `reviews`, `profile`, `settings`,
`address_management` y `provider_dashboard`: su propio repositorio, sus
propios datos mock, sin ninguna importación cruzada entre features
(solo `provider_dashboard` importa la **página** de este feature para
poder abrirla, ver más abajo). No tiene `Scaffold` propio. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia
— solo Material Icons.

## Arquitectura

```
provider_services/
├── README.md
├── mock/
│   └── mock_provider_services_data.dart   Seed: Provider/Profile/List<Service>/Category reales + views/requests/featured/lastUpdated simulados
├── models/
│   └── provider_service_display.dart      Provider + Profile + Service + Category + campos simulados/derivados
├── repositories/
│   ├── provider_services_repository.dart       Contrato: Provider, Profile, List<Service>, Category "for" un Service
│   └── mock_provider_services_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── provider_services_page.dart
    └── widgets/
        ├── services_header.dart
        ├── services_statistics.dart
        ├── services_list.dart
        ├── service_card.dart
        ├── service_status_badge.dart
        ├── service_actions.dart
        ├── add_service_button.dart
        ├── services_loading.dart
        └── services_empty_state.dart

test/features/provider_services/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 4 `Service` reales y deterministas, prefijadas
  `provider-services-`, con `ServiceStatus` distintos (2 `active`, 1
  `inactive`, 1 `archived`), compartiendo un único `Provider`/`Profile`
  ("Diana") — este feature muestra una **lista fija**, no hay lookup
  por ID todavía.
- **`repositories/`**: `ProviderServicesRepository` (contrato) +
  `MockProviderServicesRepository`, que devuelven **únicamente
  entidades reales del dominio** (`Provider`, `Profile`, `Service`,
  `Category`) — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `ProviderServiceDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `ProviderServicesPage` es el
  único lugar que instancia el repositorio y arma la lista de
  `ProviderServiceDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `provider`, `profile`, `service`, `category` | Entidades **reales** del dominio (`provider/`, `profiles/`, `service/`, `category/`), servidas por el repositorio **mock** (`MockProviderServicesRepository`, datos fijos en memoria). |
| Nombre, precio base | **Reales, no fabricados**: passthrough directo de `Service.name`/`Service.basePrice`. |
| `isPublished` | **Real, derivado**, no simulado: `Service.status == ServiceStatus.active`, expuesto con el nombre que pidió el prompt. Mismo criterio ya documentado en `ProviderProfileData.experienceYears`, `OrderDisplay.scheduledDate`, `AddressDisplay.label` y `ProviderDashboardDisplay.completedOrdersCount` — no se fabricó una segunda bandera inconsistente, ya que `Service` modela un ciclo de vida `active`/`inactive`/`archived`. |
| "Estado" (badge) y "Servicios activos"/"Servicios pausados" (estadísticas) | **Derivados** de `Service.status` real — no simulados. |
| `viewsCount`, `requestsCount` | **Totalmente simulados**: `Service` es un "pure data holder" (según su propio doc de clase: "no availability, no scheduling, no pricing rules, no reviews, no location"), sin ningún tipo de analítica/conteo de impresiones. |
| `featured` | **Totalmente simulado**: ningún módulo de dominio modela una bandera de "destacado" para servicios todavía. |
| `lastUpdatedLabel` | **Totalmente simulado**: una etiqueta de tiempo relativo sin un timestamp real que la respalde de forma consistente en el set mock (a diferencia de `Order`/`Payment`/`Notification`, aquí `Service.updatedAt` no varía por entrada). |
| "Total de solicitudes"/"Total de visualizaciones" (estadísticas) | **Suma** de los campos simulados `requestsCount`/`viewsCount` de cada servicio — simulados, igual que sus componentes. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ProviderServiceDisplay`.

**Sin colores ni iconos en el modelo**: `ProviderServiceDisplay` no
almacena ningún `Color` ni `IconData`. `ServiceStatusBadge` resuelve su
color desde `Service.status` + `context.colors.*` — nunca un literal
suelto, siguiendo la misma regla ya aplicada en
`OrderStatusBadge`/`PaymentStatusBadge`.

## Estados visuales

`ProviderServicesPage` acepta un parámetro fijo `state`
(`ProviderServicesViewState`: `loading`/`empty`/`information`) — mismo
patrón que el resto de los features desde `search`. Por defecto
renderiza `information` con los 4 servicios mock.

## Cómo conectar posteriormente

### Con Marketplace

`ProviderServiceDisplay.service`/`category` ya son las mismas entidades
reales que `marketplace` muestra públicamente. Cuando exista lookup
por ID compartido, un servicio "pausado"/"archivado" aquí debería dejar
de aparecer en `marketplace` — esa regla de negocio no existe todavía
(ambos features son independientes por diseño).

### Con Provider Dashboard

`provider_dashboard` ya resume "Servicios completados" a partir de
`Order`, no de `Service` directamente. Cuando exista lookup compartido,
`DashboardStatistics`/`ProviderPerformance` podrían enlazar aquí para
ver el detalle completo de cada servicio detrás de esos números.

### Con Categories

`ProviderServiceDisplay.category` ya es la entidad real `Category`.
Cuando `AddServiceButton` deje de ser un no-op, el futuro formulario de
creación probablemente reutilizaría el repositorio de `categories` para
poblar el selector de categoría disponible.

### Con Backend

`ProviderServicesRepository` es una interfaz Dart estándar. Para
conectar datos reales:

1. Crear `ApiProviderServicesRepository implements
   ProviderServicesRepository` en `repositories/`, implementando cada
   método con una llamada HTTP real.
2. En `ProviderServicesPage`, cambiar
   `MockProviderServicesRepository()` por la nueva implementación — es
   el único punto de construcción, ningún widget cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `ServiceActions`/`AddServiceButton`
   disparen mutaciones reales (editar/pausar/eliminar/crear) en vez de
   ser no-ops.
4. `viewsCount`/`requestsCount`/`featured`/`lastUpdatedLabel` se
   conectarían a un futuro endpoint de analítica de servicios.

## Cambio mínimo en Provider Dashboard

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_dashboard/presentation/pages/provider_dashboard_page.dart`,
el botón "Ver servicios" de `QuickActions` (antes no-op) ahora navega
con `Navigator.push` a `ProviderServicesPage` envuelta en un `Scaffold`
simple con `AppBar` (ya que `ProviderServicesPage` no construye su
propio `Scaffold`). Los otros tres botones
("Disponibilidad"/"Estadísticas"/"Configuración") siguen siendo no-op.
Ninguna otra navegación fue modificada.

## Qué widgets son reutilizables

- **`ServiceStatusBadge`**: genérico (recibe `ProviderServiceDisplay`),
  reutilizable en cualquier pantalla futura que necesite mostrar el
  estado de un servicio con el mismo mapeo de colores.
- **`ServiceCard`**: composición completa de un servicio, reutilizable
  como fila de lista en cualquier pantalla que muestre servicios de un
  proveedor.
- **`ServiceActions`**: tres botones fijos — reutilizable donde se
  necesite exactamente ese CTA triple.
- **`AddServiceButton`**: envoltorio delgado sobre `AppButton` con el
  label fijo "Nuevo servicio".
- **`ServicesEmptyState`**, **`ServicesLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, creación/
edición/pausado/eliminación real de un servicio, analítica real de
vistas/solicitudes, marcado real de "destacado", lookup por ID
individual. Los botones "Editar"/"Pausar"/"Eliminar"/"Nuevo servicio"
no hacen nada más que existir visualmente. Todo el contenido mostrado
(excepto las 4 entidades de dominio compuestas, `isPublished` y el
estado/estadísticas derivados) es simulado, como se detalla arriba.
