# Profile

Pantalla de perfil de la cuenta del cliente. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications` y `reviews`: su propio
repositorio, sus propios datos mock, sin ninguna importación cruzada
entre features. No tiene `Scaffold` propio — vive directamente dentro
del slot "Perfil" del `AppShell` (ver más abajo). Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin tipografía corporativa, sin assets
finales, sin ilustraciones ni imágenes reales — solo Material Icons. El
Sprint de Branding sigue pendiente.

## Arquitectura

```
profile/
├── README.md
├── mock/
│   └── mock_profile_data.dart      Seed: Identity/Profile/List<Contact>/Address reales + porcentaje/checklist simulados
├── models/
│   └── profile_display.dart        Profile + Identity + List<Contact> + Address + completionPercentage/profileCompletionItems simulados
├── repositories/
│   ├── profile_repository.dart       Contrato: Profile, Identity, List<Contact>, Address
│   └── mock_profile_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── profile_page.dart
    └── widgets/
        ├── profile_header.dart
        ├── profile_avatar.dart
        ├── profile_information.dart
        ├── profile_contact.dart
        ├── profile_address.dart
        ├── profile_statistics.dart
        ├── profile_actions.dart
        ├── profile_loading.dart
        └── profile_empty_state.dart

test/features/profile/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Identity`, `Profile`, `List<Contact>`, `Address`) con IDs fijos y
  deterministas, prefijados `profile-` — este feature muestra **una
  sola cuenta fija**, no hay lookup por ID todavía (no existe
  autenticación real que identifique "el usuario actual").
- **`repositories/`**: `ProfileRepository` (contrato) +
  `MockProfileRepository`, que devuelven **únicamente entidades reales
  del dominio** — nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `ProfileDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `ProfilePage` es el único lugar
  que instancia el repositorio y arma `ProfileDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `profile`, `identity`, `contacts`, `address` | Entidades **reales** del dominio (`profiles/`, `identity/`, `contact/`, `address/`), servidas por el repositorio **mock** (`MockProfileRepository`, datos fijos en memoria). |
| `displayName`, bio, cada `Contact.value`, cada campo de `Address` | **Reales, no fabricados**: passthrough directo de los campos de las entidades compuestas. |
| `memberSince` | **Derivado**, no simulado: calculado a partir del `Identity.createdAt` real — mismo criterio ya documentado en `OrderDisplay.scheduledDate`, `PaymentDisplay.paymentDate`, `NotificationDisplay.timeAgo` y `ReviewDisplay.formattedDate`. |
| `completionPercentage`, `profileCompletionItems` | **Totalmente simulados**: no existe ningún módulo de dominio que calcule "qué tan completo" está un perfil — son un número y una lista de etiquetas fijos. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `ProfileDisplay`.

**Sin colores ni iconos en el modelo**: `ProfileDisplay` no almacena
ningún `Color` ni `IconData`. `ProfileAvatar` (icono de persona
genérico), `ProfileContact` (icono por `ContactType`) y
`ProfileStatistics` (`LinearProgressIndicator` con el color por
defecto del tema) resuelven todo desde `context.colors.*`/`Icons.*` en
los widgets — nunca un literal suelto, siguiendo la misma regla ya
aplicada en el resto de los features.

## Estados visuales

`ProfilePage` acepta un parámetro fijo `state` (`ProfileViewState`:
`loading`/`empty`/`information`) — mismo patrón que
`PaymentsPage.state`/`ChatPage.state`/`NotificationsPage.state`/
`ReviewsPage.state` — para poder previsualizar cada estado en tests,
sin ninguna llamada asíncrona real detrás. Por defecto renderiza
`information` con la cuenta mock.

## Cómo conectar posteriormente

### Con Identity

`ProfileDisplay.identity` ya es la entidad real `Identity` (nombre
legal, documento, fecha de nacimiento). Cuando exista autenticación
real, `ProfileRepository.getIdentity()` devolvería la identidad de la
sesión activa en vez de un registro mock fijo.

### Con Contact

`ProfileDisplay.contacts` ya es `List<Contact>` real. Un futuro
`ApiProfileRepository` expondría los canales de contacto reales del
usuario autenticado, incluyendo verificación (`ContactStatus`) — hoy
todos los contactos mock están `active` sin flujo de verificación.

### Con Address

`ProfileDisplay.address` ya es la entidad real `Address`. Cuando el
usuario pueda tener múltiples direcciones, `ProfileRepository` pasaría
de `getAddress()` (una sola) a `getAddresses()` (lista), y
`ProfileAddress` iteraría sobre ellas como ya hace `ProfileContact`
con los contactos.

### Con Authentication

Hoy no existe ningún concepto de sesión — por eso este feature
siempre muestra la misma cuenta fija y por eso `isOwnReview`-como
campos (aquí no aplica directamente, pero el mismo principio) como
"perfil del usuario actual" son necesariamente simulados/fijos. Cuando
exista `Authentication` real, `ProfileRepository` resolvería la
identidad autenticada en vez de un mock, y "Cerrar sesión" en
`ProfileActions` dispararía un cierre de sesión real.

### Con Provider

Este feature modela el perfil de un **cliente**. Cuando el usuario
autenticado sea un proveedor, el mismo slot "Perfil" del `AppShell`
probablemente decida entre `ProfilePage` (cliente) y
`ProviderProfilePage`-equivalente propio (proveedor) según el rol de
sesión — el mismo patrón ya documentado en el README de `app_shell`
para diferenciar Home Cliente/Home Proveedor.

### Con Reviews

Ninguna reseña escrita por este usuario se muestra en este feature
todavía — `Review` no se importa aquí. Cuando exista sesión real,
`ProfileStatistics` (u otra sección nueva) podría mostrar un resumen de
las reseñas propias, reutilizando `reviews`' `ReviewsRepository` con un
filtro real por `reviewerIdentityId` (hoy simulado en `ReviewDisplay`).

## Cambio mínimo en App Shell

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`app_shell/presentation/pages/app_shell_page.dart`, el slot "Perfil"
(índice 4 del `IndexedStack`) ya no muestra `ShellPlaceholder` — ahora
renderiza `ProfilePage` directamente (sin `Scaffold` propio, como el
resto de los slots reales `HomePage`/`MarketplacePage`). Los slots
"Órdenes" y "Mensajes" siguen mostrando `ShellPlaceholder`. Ninguna
otra navegación fue modificada. Ver también el README de `app_shell`.

## Qué widgets son reutilizables

- **`ProfileAvatar`**: genérico, mismo patrón que `ProviderAvatar` en
  `provider_profile` — reutilizable donde se necesite un avatar
  simulado mientras no exista branding real.
- **`ProfileContact`**: genérico (recibe `List<Contact>`), reutilizable
  en cualquier pantalla futura que necesite listar canales de
  contacto.
- **`ProfileAddress`**: específico de este feature (recibe
  `ProfileDisplay`), pero con estructura consistente con
  `AddressResume`/`AddressSummary` de otros features.
- **`ProfileStatistics`**: estructura de progreso reutilizable donde se
  necesite mostrar un porcentaje + checklist.
- **`ProfileActions`**: envoltorio delgado sobre tres `AppButton` —
  reutilizable donde se necesiten exactamente esos tres CTA.
- **`ProfileEmptyState`**, **`ProfileLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, Firebase, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, autenticación
real (de ahí que siempre se muestre la misma cuenta fija), edición real
de perfil, cierre de sesión real, múltiples direcciones, verificación
de contacto, diferenciación de rol (cliente vs. proveedor), lookup por
ID. El botón "Editar perfil" sigue sin hacer nada más que existir
visualmente. Todo el contenido mostrado (excepto las 4 entidades de
dominio compuestas y `memberSince` derivado) es simulado, como se
detalla arriba.

**Actualización (feature `settings`)**: `ProfileHeader` ahora incluye
un ícono de engranaje (antes ausente) que navega (vía
`Navigator.push`, no `GoRouter`) a `SettingsPage` — el único cambio
permitido en este feature para ese prompt. "Cerrar sesión" vive ahora
en `SettingsPage`, no en `ProfileActions`, aunque este último la sigue
mostrando también como no-op. Ver el README de `features/settings/`
para más contexto.

**Actualización (feature `provider_dashboard`)**: `ProfileActions`
ahora incluye un tercer botón "Panel del proveedor" (antes solo
"Editar perfil"/"Cerrar sesión") que navega (vía `Navigator.push`, no
`GoRouter`) a `ProviderDashboardPage` — el único cambio permitido en
este feature para ese prompt. Ver el README de
`features/provider_dashboard/` para más contexto.
