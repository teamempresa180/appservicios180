# Service Detail

Pantalla de detalle de un servicio. **Completamente independiente** de
`marketplace`, `categories`, `search` y `home`: su propio repositorio,
sus propios datos mock, sin ninguna importación cruzada entre features
(solo `marketplace` y `search` importan la **página** de este feature
para poder abrirla, ver más abajo). No tiene `Scaffold` propio — está
preparada para insertarse dentro del `AppShell` más adelante, igual que
`home`, `marketplace`, `categories` y `search` ya lo hacen. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin ilustraciones ni imágenes reales —
solo Material Icons.

## Arquitectura

```
service_detail/
├── README.md
├── models/
│   └── service_detail_data.dart      Service + Provider + Profile + Category + Review[] + rating/reviewsCount/images/longDescription
├── repositories/
│   ├── service_detail_repository.dart       Contrato: Service, Provider, Profile, Category, List<Review>
│   └── mock_service_detail_repository.dart  Implementación en memoria
├── mock/
│   └── mock_service_detail_data.dart        Seed: Category/Provider/Profile/Service/Review[] reales + imágenes/descripción simuladas
└── presentation/
    ├── pages/
    │   └── service_detail_page.dart
    └── widgets/
        ├── service_detail_header.dart
        ├── service_gallery.dart
        ├── service_information.dart
        ├── provider_information.dart
        ├── rating_summary.dart
        └── request_service_button.dart

test/features/service_detail/ (tests del repositorio, la página, responsive)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Category`, `Provider`, `Profile`, `Service`, `List<Review>`) con IDs
  fijos y deterministas — este feature muestra **un solo servicio fijo**,
  no hay lookup por ID todavía.
- **`repositories/`**: `ServiceDetailRepository` (contrato) +
  `MockServiceDetailRepository`, que devuelven **únicamente entidades
  reales del dominio** (`Service`, `Provider`, `Profile`, `Category`,
  `List<Review>`) — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `ServiceDetailData`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `ServiceDetailPage` es el único
  lugar que instancia el repositorio y arma `ServiceDetailData`.

## Por qué existe `ServiceDetailData`

El dominio modela `Service`, `Provider`, `Profile`, `Category` y
`Review` como Aggregates independientes, cada uno referenciando a los
demás solo por ID (regla de oro DDD). Una pantalla de detalle necesita
mostrarlos **juntos**, más contenido que ningún Aggregate modela:

- **`rating`/`reviewsCount`**: se derivan aquí mismo (promedio de
  `Review.rating` y su cantidad) a partir de los `Review` simulados.
  Un backend real probablemente expondría estos ya agregados en vez de
  enviar cada `Review` — no existe ese endpoint todavía.
- **`images`**: completamente simulado. El dominio no modela una
  galería para `Service`, y no existen imágenes/ilustraciones reales
  todavía (no hay identidad visual oficial) — son solo etiquetas
  (`String`) que la UI renderiza como placeholders neutros con un
  Material Icon.
- **`longDescription`**: simulado. `Service.description` en el dominio
  es una línea corta; una pantalla de detalle necesita más contexto del
  que ese campo provee.

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ServiceDetailData`.

## Cómo conectar posteriormente `ServiceDetailRepository`

`ServiceDetailRepository` es una interfaz Dart estándar. Para conectar
datos reales:

1. Crear `ApiServiceDetailRepository implements ServiceDetailRepository`
   (o `FirebaseServiceDetailRepository`) en `repositories/`,
   implementando cada método con una llamada HTTP real, mapeando la
   respuesta a las entidades de dominio correspondientes.
2. Ese es también el momento de agregar un parámetro de ID (p. ej.
   `ServiceId`) a los métodos del contrato — hoy no existe porque la
   pantalla muestra un único servicio fijo.
3. En `ServiceDetailPage`, cambiar `MockServiceDetailRepository()` por
   la nueva implementación — es el único punto de construcción, ningún
   widget cambia.
4. `rating`/`reviewsCount` pasarían a venir de un endpoint de
   agregación real de `Review`; `images` desde el módulo de contenido
   (`Attachment`) una vez existan imágenes reales; `longDescription`
   podría convertirse en un campo real de `Service` si el dominio se
   amplía para soportarlo.
5. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red) y de que "Solicitar servicio"
   dispare un flujo real (probablemente creando una `Quote`, no
   implementado todavía).

## Cambio mínimo en Marketplace y Search

Este prompt autorizó explícitamente un único cambio en cada uno de esos
dos features, exclusivamente para poder abrir esta pantalla:

- **`marketplace/presentation/widgets/service_card.dart`**: se agregó
  `onTap` al `AppCard` existente (parámetro que ya existía en el Design
  System, no se modificó `core/ui`), navegando con `Navigator.push` a
  `ServiceDetailPage` envuelta en un `Scaffold` simple con `AppBar`
  (ya que `ServiceDetailPage` no construye su propio `Scaffold`).
- **`search/presentation/widgets/search_result_card.dart`**: el botón
  "Ver", que antes era un no-op (`onPressed: () {}`), ahora hace la
  misma navegación.

En ambos casos, **cualquier** tarjeta/resultado abre el mismo servicio
simulado fijo, ya que `ServiceDetailRepository` todavía no acepta un ID
— esto es intencional y documentado también en los README de
`marketplace` y `search`.

## Qué widgets son reutilizables

- **`ServiceGallery`**: genérico (recibe `List<String>`), reutilizable
  en cualquier otra pantalla que necesite una galería de placeholders
  simulados.
- **`ServiceInformation`**, **`ProviderInformation`**, **`RatingSummary`**:
  específicos de este feature (reciben `ServiceDetailData` completo),
  pero suficientemente genéricos en su estructura interna (tarjeta +
  `AppSectionTitle`) como para servir de referencia a futuras pantallas
  de detalle (p. ej. detalle de Proveedor).
- **`RequestServiceButton`**: envoltorio delgado sobre `AppButton` con
  el label fijo "Solicitar servicio" — reutilizable donde se necesite
  exactamente ese CTA.

## Qué NO existe todavía (a propósito)

Chat, Quotes, Orders, Payments, lookup por ID (un único servicio fijo),
conexión a Backend/Firebase/API, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia. El botón
"Solicitar servicio" no hace nada. Todo el contenido mostrado (excepto
las 5 entidades de dominio compuestas) es simulado.

**Actualización (feature `provider_profile`)**: la tarjeta
`ProviderInformation` ahora navega (vía `Navigator.push`, no
`GoRouter`) a una vista previa de `ProviderProfilePage` al tocarla — el
único cambio permitido en este feature para ese prompt. Como
`ProviderProfilePage` también muestra un único proveedor fijo simulado,
esto no depende todavía del proveedor real de este servicio. Ver el
README de `features/provider_profile/` para más contexto.
