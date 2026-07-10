# Contact Management

Pantalla de gestión de canales de contacto (correo, teléfono, otro).
**Completamente independiente** de `marketplace`, `categories`,
`search`, `home`, `service_detail`, `provider_profile`,
`request_service`, `quote`, `orders`, `payments`, `chat`,
`notifications`, `reviews`, `profile`, `settings`,
`address_management`, `provider_dashboard`, `provider_services`,
`availability`, `verification`, `trust` y `schedule`: su propio
repositorio, sus propios datos mock, sin ninguna importación cruzada
entre features (solo `settings` importa la **página** de este feature
para poder abrirla, ver más abajo). No tiene `Scaffold` propio.
Reutiliza exclusivamente el Design System existente. Sin identidad
visual propia — solo Material Icons.

## Por qué este prompt: `Contact` ya existía pero nunca tuvo pantalla propia

El módulo de dominio `Contact` (correo/teléfono asociado a una
`Identity`) existe desde el inicio del proyecto, pero hasta ahora solo
se había usado como **dato de apoyo**: `address_management` (Prompt 40)
reutiliza un único `Contact` fijo dentro de cada `AddressDisplay` para
mostrar un teléfono junto a la dirección. Ningún feature le había dado
a `Contact` su propia pantalla de gestión — este prompt hace
exactamente eso, con el mismo tratamiento que ya recibieron
`Address`/`Availability`/`Schedule`: una lista completa de los propios
registros reales, no un valor prestado de otro feature.

## Arquitectura

```
contact_management/
├── README.md
├── mock/
│   └── mock_contacts_data.dart              Seed: Profile + 5 Contact reales
├── models/
│   └── contact_management_display.dart       Profile + List<Contact>, todo derivado
├── repositories/
│   ├── contact_management_repository.dart     Contrato: Profile, List<Contact>
│   └── mock_contact_management_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── contact_management_page.dart
    └── widgets/
        ├── contacts_header.dart
        ├── contacts_statistics.dart
        ├── contact_card.dart
        ├── contact_actions.dart
        ├── add_contact_button.dart
        ├── contacts_loading.dart
        └── contacts_empty_state.dart

test/features/contact_management/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único `Profile` real y determinista, más 5 `Contact`
  reales que cubren cada valor de `ContactType`
  (`email`/`phone`/`other`) y `ContactStatus`
  (`active`/`inactive`/`archived`) al menos una vez, todos prefijados
  `contact-management-` — este feature muestra los contactos de **una
  sola cuenta fija**, no hay lookup por ID ni autenticación real
  todavía.
- **`repositories/`**: `ContactManagementRepository` (contrato) +
  `MockContactManagementRepository`, que devuelven **únicamente
  entidades reales del dominio** (`Profile`, `Contact`) — nunca
  `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `ContactManagementDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `ContactManagementPage` es el
  único lugar que instancia el repositorio y arma
  `ContactManagementDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `profile`, `contacts` | Entidades **reales** del dominio (`profiles/`, `contact/`), servidas por el repositorio **mock** (`MockContactManagementRepository`, datos fijos en memoria). |
| Conteos por estado (`activeCount`/`inactiveCount`/`archivedCount`), tipo/valor/estado de cada contacto | **Derivados, no simulados**: calculados directamente de la lista real de `Contact`. |

**No existe ningún campo simulado en este feature** — mismo criterio
ya aplicado en `schedule` (Prompt 46): el dominio `Contact` ya modela
exactamente lo que la pantalla necesita (tipo, valor, estado), así que
no hubo ningún dato ausente que fabricar.

**Sin colores ni iconos en el modelo**: `ContactManagementDisplay` no
almacena ningún `Color` ni `IconData`. `ContactCard` resuelve su ícono
(por tipo) y su color de estado desde `Icons.*`/`context.colors.*` —
nunca un literal suelto, siguiendo la misma regla ya aplicada en
`OrderStatusBadge`/`ScheduleBlockCard`.

## Estados visuales

`ContactManagementPage` acepta un parámetro fijo `state`
(`ContactManagementViewState`: `loading`/`empty`/`information`) —
mismo patrón que el resto de los features desde `search`. Por defecto
renderiza `information` con los 5 contactos mock.

## Cómo conectar posteriormente

### Con Address Management

`address_management` reutiliza hoy un único `Contact` fijo e
independiente del de este feature. Cuando exista sesión real, ambos
features resolverían la misma lista de `Contact` de la `Identity`
autenticada, y `AddressCard` podría enlazar al contacto real
correspondiente en esta pantalla.

### Con Backend

`ContactManagementRepository` es una interfaz Dart estándar. Para
conectar datos reales:

1. Crear `ApiContactManagementRepository implements
   ContactManagementRepository` en `repositories/`, implementando cada
   método con una llamada HTTP real.
2. En `ContactManagementPage`, cambiar
   `MockContactManagementRepository()` por la nueva implementación —
   es el único punto de construcción, ningún widget cambia.
3. Ese también sería el momento de que "Agregar contacto"/"Editar"/
   "Eliminar" disparen operaciones reales en vez de ser no-ops.

## Cambio mínimo en Settings

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en `settings/models/settings_option.dart`
se agregó `SettingsOptionId.contacts` ("Contactos", junto a
"Direcciones") y en
`settings/presentation/pages/settings_page.dart` se conectó esa opción
para navegar con `Navigator.push` a `ContactManagementPage` — el mismo
patrón que ya usa "Direcciones" para abrir `AddressManagementPage`.
Ninguna otra navegación fue modificada.

## Qué widgets son reutilizables

- **`ContactCard`**: genérico (recibe un `Contact`), reutilizable en
  cualquier pantalla futura que necesite el mismo formato de fila
  tipo/valor/estado.
- **`ContactActions`**: dos botones fijos — reutilizable donde se
  necesite exactamente ese CTA doble, mismo espíritu que
  `AddressActions`.
- **`ContactsEmptyState`**, **`ContactsLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, autenticación real, verificación real de
alcanzabilidad (envío de código a email/teléfono), lookup por ID. Los
botones "Agregar contacto"/"Editar"/"Eliminar" no hacen nada más que
existir visualmente. Todo el contenido mostrado es real o derivado de
datos reales, como se detalla arriba.
