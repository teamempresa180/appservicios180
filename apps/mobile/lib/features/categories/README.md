# Categories

Pantalla con todas las categorías de servicio disponibles, en una grilla
responsiva. **Completamente independiente del feature `marketplace`**:
su propio repositorio, sus propios datos mock, sin ninguna importación
cruzada entre ambos. Marketplace navegará hacia aquí en el futuro (no
implementado todavía). No tiene `Scaffold` propio — está preparada para
insertarse dentro del `AppShell` más adelante, igual que `home` y
`marketplace` ya lo hacen. Reutiliza exclusivamente el Design System
existente. Sin identidad visual propia: sin logo, sin colores de marca,
sin ilustraciones — solo Material Icons.

## Arquitectura

```
categories/
├── README.md
├── models/
│   └── category_display.dart      Category + servicesCount simulado
├── repositories/
│   ├── category_repository.dart       Contrato abstracto: List<Category>
│   └── mock_category_repository.dart  Implementación en memoria
├── mock/
│   └── mock_categories_data.dart      Seed: 12 Category reales + conteo simulado
└── presentation/
    ├── pages/
    │   └── categories_page.dart
    └── widgets/
        ├── categories_header.dart
        ├── categories_grid.dart
        ├── category_grid_item.dart
        └── categories_empty_state.dart
```

- **`mock/`**: 12 entidades `Category` reales del dominio (Plomería,
  Electricidad, Limpieza, Jardinería, Pintura, Mascotas, Tecnología,
  Belleza, Construcción, Mudanzas, Cerrajería, Climatización) con IDs
  fijos y deterministas, más un mapa simple `Map<String, int>` con el
  conteo de servicios simulado por categoría.
- **`repositories/`**: `CategoryRepository` (contrato) +
  `MockCategoryRepository` (implementación), que devuelve
  **únicamente** `List<Category>` — nada de `Map<String, dynamic>` ni
  `dynamic`.
- **`models/`**: `CategoryDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros que reciben `CategoryDisplay` ya
  resuelto; `CategoriesPage` es el único lugar que instancia el
  repositorio y arma la lista de `CategoryDisplay`.

## Por qué existe `CategoryDisplay`

`Category` (el Aggregate Root del dominio) no tiene, ni debería tener,
un campo de "cantidad de servicios" — eso es una agregación que en un
sistema real calcularía el módulo `Service` (contando cuántos servicios
activos referencian esa `categoryId`), no un atributo propio de
`Category`. `CategoryDisplay` compone la entidad real (`Category`) con
ese único dato adicional que la grilla necesita mostrar, sin tocar ni
extender la entidad de dominio. Es intencionalmente mínimo: solo
`category` + `servicesCount`, nada más.

## Cómo reemplazar `MockCategoryRepository`

`CategoryRepository` es una interfaz Dart estándar con un solo método,
`getAll()`. Para conectar datos reales:

1. Crear `ApiCategoryRepository implements CategoryRepository` (o
   `FirebaseCategoryRepository`) en `repositories/`, implementando
   `getAll()` con una llamada HTTP real o una consulta a Firestore,
   mapeando la respuesta a `List<Category>` (nunca exponiendo JSON
   crudo fuera del repositorio).
2. En `CategoriesPage`, cambiar `MockCategoryRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. El conteo de servicios simulado (`mockCategoryServicesCount`, hoy un
   mapa fijo en `mock/`) pasaría a resolverse desde el módulo real
   `Service` del backend — probablemente un método adicional en la
   nueva implementación del repositorio, o un repositorio de `Service`
   aparte, según cómo se diseñe esa consulta.
4. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red) — hoy `isLoading`/`forceEmpty` en
   `CategoriesPage` son banderas de solo demostración visual, no un
   estado real derivado de una petición.

## Qué widgets son reutilizables

- **`CategoryGridItem`**: genérico (recibe un `CategoryDisplay` ya
  resuelto), reutilizable en cualquier otra grilla de categorías futura
  (p. ej. dentro del propio Marketplace si decide mostrar una vista
  previa).
- **`CategoriesGrid`**: contenedor de grilla responsiva reutilizable
  para cualquier lista futura de tarjetas similares — ya maneja el
  estado vacío internamente.
- **`CategoriesHeader`**, **`CategoriesEmptyState`**: específicos de
  esta pantalla (copy fijo), no pensados para reutilizarse en otro
  lugar.

## Estados visuales

`CategoriesPage` puede mostrar tres estados, todos puramente visuales
(sin lógica ni gestión de estado real):

- **Normal**: `CategoriesGrid` con las 12 categorías.
- **Vacío**: pasar `forceEmpty: true` — muestra `CategoriesEmptyState`.
- **Cargando**: pasar `isLoading: true` — muestra `AppLoading`.

## Qué NO existe todavía (a propósito)

Filtros, ordenamiento, búsqueda, favoritos, navegación desde/hacia
Marketplace, conexión a Backend/Firebase/API, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel). Todo el contenido mostrado es
simulado.
