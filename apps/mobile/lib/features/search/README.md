# Search

Pantalla de búsqueda de servicios. **Completamente independiente** de
`marketplace` y `categories`: su propio repositorio, sus propios datos
mock, sin ninguna importación cruzada entre features. Marketplace
navegará hacia aquí en el futuro (no implementado todavía). No tiene
`Scaffold` propio — está preparada para insertarse dentro del
`AppShell` más adelante, igual que `home`, `marketplace` y `categories`
ya lo hacen. Reutiliza exclusivamente el Design System existente. Sin
identidad visual propia: sin logo, sin colores de marca, sin
ilustraciones — solo Material Icons.

## Arquitectura

```
search/
├── README.md
├── models/
│   └── search_result.dart         Service + Provider + Category + rating/reviewsCount/distance simulados
├── repositories/
│   ├── search_repository.dart       Contrato abstracto: List<Service>
│   └── mock_search_repository.dart  Implementación en memoria
├── mock/
│   └── mock_search_data.dart        Seed: Category/Provider/Service reales + ratings/reviews/distancia simulados
└── presentation/
    ├── pages/
    │   └── search_page.dart
    └── widgets/
        ├── search_header.dart
        ├── search_bar.dart          (clase `SearchInputBar`, ver nota de nombres más abajo)
        ├── search_results.dart
        ├── search_result_card.dart
        ├── search_empty_state.dart
        └── search_loading.dart
```

- **`mock/`**: entidades reales del dominio (`Category`, `Provider`,
  `Service`) con IDs fijos y deterministas, más tres mapas simples
  (`Map<String, double>`/`Map<String, int>`) con rating, cantidad de
  reseñas y distancia simulados por servicio.
- **`repositories/`**: `SearchRepository` (contrato, un solo método
  `getAll()`) + `MockSearchRepository`, que devuelve **únicamente**
  `List<Service>` — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `SearchResult`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `SearchPage` es el único lugar
  que instancia el repositorio y arma la lista de `SearchResult`.

**Nota de nombres**: el archivo `search_bar.dart` define una clase
`SearchInputBar`, no `SearchBar` — Flutter/Material 3 ya tiene un
widget llamado `SearchBar` en `package:flutter/material.dart`, y
reutilizar ese nombre habría chocado con él.

## Por qué existe `SearchResult`

El dominio modela `Service`, `Provider` y `Category` como Aggregates
independientes, cada uno referenciando a los demás solo por ID (regla
de oro DDD). Ninguno tiene, ni debería tener, los campos que una
tarjeta de resultado de búsqueda necesita mostrar juntos: calificación,
cantidad de reseñas y distancia son conceptos que en un sistema real
vendrían de otros Aggregates (`Review`, geolocalización) o de un
cálculo de agregación en el backend — no de `Service` en sí.
`SearchResult` compone las tres entidades reales (`Service`,
`Provider`, `Category`) con esos tres campos simulados, **sin agregar
nada a las entidades de dominio** y sin ningún campo adicional más
allá de los seis pedidos.

Una consecuencia intencional de esa restricción: `SearchResult` no
incluye `Profile`, así que no hay un nombre de proveedor "bonito" para
mostrar (`Provider` en el dominio no tiene nombre propio, solo
`providerProfileId`). `SearchResultCard` muestra en su lugar
`Provider.biography` — el campo real más cercano disponible sin
ampliar la composición. Esto queda documentado aquí a propósito, como
una limitación conocida y aceptada de este prompt.

## Cómo conectar posteriormente `SearchRepository`

`SearchRepository` es una interfaz Dart estándar con un solo método,
`getAll()`. Para conectar datos reales:

1. Crear `ApiSearchRepository implements SearchRepository` (o
   `FirebaseSearchRepository`) en `repositories/`, implementando
   `getAll()` con una llamada HTTP real (probablemente con parámetros
   de búsqueda/paginación en ese punto, ya que hoy no existen), mapeando
   la respuesta a `List<Service>`.
2. En `SearchPage`, cambiar `MockSearchRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Los valores simulados (`mockSearchRatings`/`mockSearchReviewsCount`/
   `mockSearchDistanceKm`) pasarían a resolverse desde `Review` (rating,
   reviewsCount) y un servicio de geolocalización real (distance).
4. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red, y para que escribir en
   `SearchInputBar` dispare una búsqueda real con debounce) — hoy no
   existe porque `MockSearchRepository` es síncrono e instantáneo, y
   `onChanged` en `SearchInputBar` es intencionalmente un no-op.

## Cómo reutilizar `SearchResult` cuando exista Backend

`SearchResult` no depende de dónde vengan sus tres entidades — cuando
`ApiSearchRepository` devuelva `Service` reales, el mismo patrón de
composición (buscar el `Provider`/`Category` correspondiente por ID y
simular o resolver rating/reviewsCount/distance) seguiría funcionando
sin cambios en `SearchResultCard`, `SearchResults` ni `SearchPage`'s
widgets — solo cambiaría **de dónde** se obtienen esos tres valores
(de un mapa fijo a una respuesta real de `Review`/geolocalización).
Es decir: `SearchResult` ya tiene la forma correcta para el día en que
haya datos reales, no habrá que rediseñarlo.

## Estados visuales

`SearchPage` recibe un `SearchViewState` (`loading`, `empty`, `results`,
`noResults`) puramente visual — no hay ninguna lógica que conecte lo
que se escribe en `SearchInputBar` con el estado mostrado:

- **`results`** (default): `SearchResults` con las 4 coincidencias mock.
- **`empty`**: `SearchEmptyState` invitando a escribir algo.
- **`noResults`**: `SearchEmptyState` indicando que no hubo
  coincidencias.
- **`loading`**: `SearchLoading` (envuelve `AppLoading`).

## Qué NO existe todavía (a propósito)

Búsqueda real, filtros, ordenamiento, autocomplete, historial, conexión
a Backend/Firebase/API, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel). Todo el contenido mostrado es
simulado.

**Actualización (feature `service_detail`)**: el botón "Ver" ahora
navega (vía `Navigator.push`, no `GoRouter`) a una vista previa de
`ServiceDetailPage` — el único cambio permitido en este feature para
ese prompt. Como `ServiceDetailPage` todavía muestra un único servicio
fijo simulado (no hay lookup por ID), **cualquier** resultado abre el
mismo detalle sin importar cuál se toque. Ver el README de
`features/service_detail/` para más contexto.
