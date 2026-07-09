# Marketplace

Pantalla de exploración de servicios y proveedores. Vive dentro del
`AppShell` (destino "Buscar" del `IndexedStack`) — no tiene `Scaffold`,
`AppBar` ni navegación propia. Reutiliza exclusivamente el Design
System existente. Sin identidad visual propia: sin logo, sin colores de
marca, sin ilustraciones — solo Material Icons. Todos los datos son
simulados; no hay conexión a ningún backend.

## Arquitectura del Marketplace

```
marketplace/
├── README.md
├── models/
│   ├── service_display.dart    Service + nombre de proveedor/categoría + rating simulado
│   └── provider_display.dart   Provider + Profile (nombre) + rating/conteo simulados
├── repositories/
│   ├── category_repository.dart       Contrato abstracto
│   ├── mock_category_repository.dart  Implementación en memoria
│   ├── service_repository.dart        Contrato abstracto
│   ├── mock_service_repository.dart   Implementación en memoria
│   ├── provider_repository.dart       Contrato abstracto
│   └── mock_provider_repository.dart  Implementación en memoria
├── mock/
│   ├── mock_categories_data.dart      Seed: List<Category>
│   ├── mock_services_data.dart        Seed: List<Service> + ratings simulados
│   └── mock_providers_data.dart       Seed: List<Provider> + List<Profile> + ratings/conteos simulados
└── presentation/
    ├── pages/
    │   └── marketplace_page.dart
    └── widgets/
        ├── marketplace_header.dart
        ├── search_bar.dart
        ├── categories_section.dart
        ├── category_chip.dart
        ├── featured_services.dart
        ├── service_card.dart
        ├── recommended_providers.dart
        └── provider_card.dart
```

Cuatro capas con responsabilidades distintas y sin superposición:

- **`mock/`**: datos semilla fijos y deterministas (IDs como
  `'provider-ana'`, no `ProviderId.create()`) para que las referencias
  cruzadas (`Service.providerId` ↔ `Provider.id`, etc.) sean estables.
- **`repositories/`**: un contrato abstracto por entidad de dominio
  (`CategoryRepository`, `ServiceRepository`, `ProviderRepository`) +
  su implementación `Mock*Repository`, que lee de `mock/` y devuelve
  **únicamente** entidades del dominio (`Category`, `Service`,
  `Provider`, `Profile`) — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `ServiceDisplay`/`ProviderDisplay` — clases tipadas que
  *componen* una entidad de dominio con los datos que la UI necesita
  pero que el dominio no modela (nombre resuelto, rating simulado,
  conteo simulado). Ningún campo nuevo se agrega a `Service` ni
  `Provider` — la composición ocurre aquí, no en el dominio.
- **`presentation/`**: widgets puros; reciben `Category`/`ServiceDisplay`/
  `ProviderDisplay` ya resueltos, nunca conocen los repositorios.

`MarketplacePage` (en `presentation/pages/`) es el único lugar que
instancia los tres `Mock*Repository` y arma las listas de
`ServiceDisplay`/`ProviderDisplay` antes de pasarlas a los widgets.

## Por qué se utilizan MockRepositories

El dominio ya modela `Category`, `Service` y `Provider` como Aggregate
Roots independientes (regla de oro: solo se referencian por ID, nunca se
anidan). Pero **ninguno de los tres tiene todavía una implementación de
repositorio real** — ni en el backend (`apps/backend/.../infrastructure/`
está vacía) ni en Flutter. Los `Mock*Repository` existen para:

1. Permitir construir y probar la UI del Marketplace ya mismo, sin
   esperar a que exista base de datos, API ni autenticación real.
2. Demostrar que la UI solo depende de los **contratos**
   (`CategoryRepository`, `ServiceRepository`, `ProviderRepository`), no
   de su implementación — el día que exista un backend real, el
   reemplazo es mecánico.
3. Mantener los datos simulados como **entidades de dominio reales**
   (no mapas sueltos), para que el día del reemplazo no haya que tocar
   ningún widget: ya reciben `Category`/`Service`/`Provider`/`Profile`
   tal como los recibirán de una fuente real.

## Cómo reemplazarlos posteriormente por FirebaseRepository o ApiRepository

Cada contrato (`CategoryRepository`, `ServiceRepository`,
`ProviderRepository`) es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiCategoryRepository implements CategoryRepository` (o
   `FirebaseCategoryRepository`) en `repositories/`, implementando
   `getAll()`/`getById()` con una llamada HTTP real o una consulta a
   Firestore, mapeando la respuesta a `Category` (nunca exponiendo el
   JSON crudo fuera del repositorio).
2. Repetir para `Service` y `Provider`.
3. En `MarketplacePage`, cambiar `MockCategoryRepository()` por
   `ApiCategoryRepository(...)` (y equivalentes) — es el único punto de
   construcción, ningún widget cambia.
4. Los métodos `profileOf`/`ratingOf`/`servicesCountOf` de
   `ProviderRepository` (hoy simulados con mapas fijos en `mock/`)
   pasarían a consultar los módulos reales `Profiles`/`Review`/`Service`
   del backend respectivamente.
5. En ese punto también será el momento de introducir gestión de estado
   (para loading/error de red) — hoy no existe porque los
   `Mock*Repository` son síncronos e instantáneos.

## Qué widgets son reutilizables

- **`CategoryChip`**, **`ServiceCard`**, **`ProviderCard`**: genéricos
  dentro del dominio de negocio (reciben una entidad ya resuelta),
  reutilizables en otras pantallas futuras (p. ej. resultados de
  búsqueda, perfil de categoría).
- **`CategoriesSection`**, **`FeaturedServices`**,
  **`RecommendedProviders`**: contenedores de scroll horizontal
  reutilizables para cualquier lista futura de tarjetas similares.
- **`MarketplaceHeader`**, **`MarketplaceSearchBar`**: específicos de
  esta pantalla (título fijo, sin lógica de búsqueda), no pensados para
  reutilizarse en otro lugar.

## Qué NO existe todavía (a propósito)

Búsqueda real, filtros, favoritos, conexión a Backend/Firebase/API,
gestión de estado (Provider/Riverpod/Bloc/Cubit/ViewModels). Todo el
contenido mostrado es simulado.

**Actualización (feature `service_detail`)**: tocar una tarjeta de
`ServiceCard` ahora navega (vía `Navigator.push`, no `GoRouter`) a una
vista previa de `ServiceDetailPage` — el único cambio permitido en este
feature para ese prompt. Como `ServiceDetailPage` todavía muestra un
único servicio fijo simulado (no hay lookup por ID), **cualquier**
tarjeta abre el mismo detalle sin importar cuál se toque. Ver el README
de `features/service_detail/` para más contexto.
