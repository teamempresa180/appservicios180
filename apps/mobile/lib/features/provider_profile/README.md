# Provider Profile

Pantalla de perfil de un proveedor. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home` y `service_detail`: su
propio repositorio, sus propios datos mock, sin ninguna importación
cruzada entre features (solo `service_detail` importa la **página** de
este feature para poder abrirla, ver más abajo). No tiene `Scaffold`
propio — está preparada para insertarse dentro del flujo de navegación
existente más adelante, igual que el resto de los features de esta
serie. Reutiliza exclusivamente el Design System existente. Sin
identidad visual propia: sin logo, sin colores negro/dorado/blanco, sin
tipografía corporativa, sin assets finales, sin ilustraciones ni
imágenes reales — solo Material Icons. El Sprint de Branding sigue
pendiente (Prompt 33.1).

## Arquitectura

```
provider_profile/
├── README.md
├── models/
│   └── provider_profile_data.dart   Provider + Profile + Availability + Review[] + Service[] + Category[] + stats
├── repositories/
│   ├── provider_profile_repository.dart       Contrato: Provider, Profile, Availability, List<Review>, List<Service>, List<Category>
│   └── mock_provider_profile_repository.dart  Implementación en memoria
├── mock/
│   └── mock_provider_profile_data.dart        Seed: entidades reales + stats/contenido simulados
└── presentation/
    ├── pages/
    │   └── provider_profile_page.dart
    └── widgets/
        ├── provider_profile_header.dart   (compone cover + avatar + nombre + rating)
        ├── provider_cover.dart
        ├── provider_avatar.dart
        ├── provider_information.dart
        ├── provider_statistics.dart
        ├── provider_specialties.dart
        ├── provider_services.dart
        ├── provider_availability.dart
        ├── provider_reviews_summary.dart
        └── provider_actions.dart

test/features/provider_profile/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Provider`, `Profile`, `Availability`, `List<Review>`, `List<Service>`,
  `List<Category>`) con IDs fijos y deterministas — este feature muestra
  **un solo proveedor fijo**, no hay lookup por ID todavía.
- **`repositories/`**: `ProviderProfileRepository` (contrato) +
  `MockProviderProfileRepository`, que devuelven **únicamente entidades
  reales del dominio** — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `ProviderProfileData`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `ProviderProfilePage` es el único
  lugar que instancia el repositorio y arma `ProviderProfileData`.

## Qué es real, derivado o simulado en `ProviderProfileData`

| Campo | Origen |
|---|---|
| `provider`, `profile`, `availability`, `reviews`, `services`, `categories` | Entidades **reales** del dominio, vía el repositorio. |
| `rating`, `reviewsCount` | **Derivados** de `reviews` (promedio y cantidad) — mismo enfoque que `service_detail`. |
| `experienceYears` | **Real, no fabricado**: passthrough directo de `Provider.yearsOfExperience`, expuesto con el nombre que pidió la UI. El prompt lo listó como "simulado", pero aquí se documenta que es un campo real del dominio — no se inventó un segundo número inconsistente. |
| `completedServices`, `responseTime` | **Simulados**: no existe todavía un endpoint de agregación de `Order`/`Review` que calcule esto. |
| `coverImages` | **Simulado**: el dominio no modela portada/galería para `Provider`, y no existen imágenes reales todavía. Son solo etiquetas (`String`); hoy solo se renderiza la primera (`ProviderCover`) — el resto queda reservado para un futuro carrusel. |
| `about` | **Simulado**: más extenso que `Provider.biography`, que en el dominio es una línea corta. |
| `specialties` | **Simulado**: sin equivalente en el dominio. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ProviderProfileData`.

## Cómo conectar posteriormente `ProviderProfileRepository`

`ProviderProfileRepository` es una interfaz Dart estándar. Para
conectar datos reales:

1. Crear `ApiProviderProfileRepository implements ProviderProfileRepository`
   (o `FirebaseProviderProfileRepository`) en `repositories/`,
   implementando cada método con una llamada HTTP real, mapeando la
   respuesta a las entidades de dominio correspondientes.
2. Ese es también el momento de agregar un parámetro de ID (p. ej.
   `ProviderId`) a los métodos del contrato — hoy no existe porque la
   pantalla muestra un único proveedor fijo.
3. En `ProviderProfilePage`, cambiar `MockProviderProfileRepository()`
   por la nueva implementación — es el único punto de construcción,
   ningún widget cambia.
4. `completedServices`/`responseTime` pasarían a venir de un endpoint de
   agregación real de `Order`/`Review`; `coverImages` desde el módulo de
   contenido (`Attachment`) una vez existan imágenes reales;
   `specialties` podría convertirse en un campo real si el dominio se
   amplía para soportarlo (hoy ningún módulo lo modela).
5. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red) y de que "Solicitar servicio"/
   "Chat" disparen flujos reales (Quote y Chat respectivamente, ninguno
   implementado todavía).

## Cambio mínimo en Service Detail

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`service_detail/presentation/widgets/provider_information.dart`, se
agregó `onTap` al `AppCard` existente (parámetro que ya existía en el
Design System, no se modificó `core/ui`), navegando con
`Navigator.push` a `ProviderProfilePage` envuelta en un `Scaffold`
simple con `AppBar` (ya que `ProviderProfilePage` no construye su
propio `Scaffold`). Ninguna otra navegación fue modificada.

Como ambos features muestran un único registro fijo simulado, tocar la
tarjeta de proveedor en **cualquier** Service Detail abre el mismo
perfil de proveedor simulado — intencional y documentado también en el
README de `service_detail`.

## Qué widgets son reutilizables

- **`ProviderAvatar`**, **`ProviderCover`**: genéricos (icono + label),
  reutilizables en cualquier pantalla futura que necesite un
  avatar/portada simulados mientras no exista branding real.
- **`ProviderStatistics`**: estructura de grid de estadísticas
  reutilizable, aunque construida localmente (no importa el `StatCard`
  de `home`, para mantener los features independientes).
- **`ProviderInformation`**, **`ProviderSpecialties`**,
  **`ProviderServices`**, **`ProviderAvailability`**,
  **`ProviderReviewsSummary`**: específicos de este feature (reciben
  `ProviderProfileData`/entidades concretas), pero con una estructura
  interna (tarjeta + `AppSectionTitle`) consistente con el resto de la
  app.
- **`ProviderActions`**: envoltorio delgado sobre cuatro `AppButton` con
  labels fijos — reutilizable donde se necesiten exactamente esos
  cuatro CTA.

## Qué NO existe todavía (a propósito)

Chat, mensajes, agenda/booking real, solicitudes reales, pagos, lookup
por ID (un único proveedor fijo), conexión a Backend/Firebase/API,
gestión de estado (Provider/Riverpod/Bloc/Cubit/ViewModel),
persistencia. El botón "Chat" no hace nada. Todo el contenido mostrado
(excepto las entidades de dominio compuestas) es simulado o derivado,
como se detalla arriba.

**Actualización (feature `request_service`)**: el botón "Solicitar
servicio" en `ProviderActions` ya no es un no-op — ahora navega (vía
`Navigator.push`, no `GoRouter`) a `RequestServicePage`, el único
cambio permitido en este feature para ese prompt. Como
`RequestServicePage` también muestra un único servicio/proveedor fijo
simulado, esto no depende todavía del proveedor real de este perfil.
Ver el README de `features/request_service/` para más contexto.

**Actualización (feature `verification`)**: `ProviderActions` ahora
incluye un tercer botón "Verificación" (antes solo "Solicitar
servicio"/"Chat") que navega (vía `Navigator.push`, no `GoRouter`) a
`VerificationPage` — el único cambio permitido en este feature para
ese prompt. Ver el README de `features/verification/` para más
contexto.

**Actualización (feature `trust`)**: `ProviderActions` ahora incluye un
cuarto botón "Confianza" (antes "Solicitar servicio"/"Chat"/
"Verificación") que navega (vía `Navigator.push`, no `GoRouter`) a
`TrustPage` — el único cambio permitido en este feature para ese
prompt. Ver el README de `features/trust/` para más contexto.
