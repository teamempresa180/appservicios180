# Address Management

Pantalla de administración de direcciones guardadas. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications`, `reviews`, `profile` y
`settings`: su propio repositorio, sus propios datos mock, sin ninguna
importación cruzada entre features (solo `settings` importa la
**página** de este feature para poder abrirla, ver más abajo). No
tiene `Scaffold` propio. Reutiliza exclusivamente el Design System
existente. Sin identidad visual propia: sin logo, sin colores de
marca, sin tipografía corporativa, sin assets finales, sin
ilustraciones ni imágenes reales — solo Material Icons. El Sprint de
Branding sigue pendiente.

## Arquitectura

```
address_management/
├── README.md
├── mock/
│   └── mock_addresses_data.dart        Seed: 3 Address reales (Casa/Trabajo/Oficina) + Profile/Contact compartidos + isDefault/instrucciones simulados
├── models/
│   └── address_display.dart            Address + Profile + Contact + isDefault/deliveryInstructions simulados
├── repositories/
│   ├── address_management_repository.dart       Contrato: List<Address>, Profile, Contact "for" un Address
│   └── mock_address_management_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── address_management_page.dart
    └── widgets/
        ├── addresses_header.dart
        ├── address_card.dart
        ├── default_address_badge.dart
        ├── address_actions.dart
        ├── address_form_preview.dart
        ├── add_address_button.dart
        ├── addresses_loading.dart
        └── addresses_empty_state.dart

test/features/address_management/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 3 `Address` reales y deterministas ("Casa"/"Trabajo"/
  "Oficina"), prefijadas `address-management-`, compartiendo un único
  `Profile`/`Contact` por simplicidad — este feature muestra una
  **lista fija**, no hay lookup por ID todavía.
- **`repositories/`**: `AddressManagementRepository` (contrato) +
  `MockAddressManagementRepository`, que devuelven **únicamente
  entidades reales del dominio** (`Address`, `Profile`, `Contact`) —
  nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `AddressDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `AddressManagementPage` es el
  único lugar que instancia el repositorio y arma la lista de
  `AddressDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `address`, `profile`, `contact` | Entidades **reales** del dominio (`address/`, `profiles/`, `contact/`), servidas por el repositorio **mock** (`MockAddressManagementRepository`, datos fijos en memoria). |
| `label` | **Real, no fabricado**: passthrough directo de `Address.alias` (ya "Casa"/"Trabajo"/"Oficina" en el dominio), expuesto con el nombre que pidió el prompt. Mismo criterio ya documentado en `ProviderProfileData.experienceYears`, `QuoteData.subtotal`, `OrderDisplay.scheduledDate` y `PaymentDisplay.paymentMethod` — no se inventó una segunda etiqueta inconsistente. |
| Dirección completa, ciudad, departamento | **Reales, no fabricados**: passthrough directo de `Address.fullAddress`/`Address.city`/`Address.state`. |
| `isDefault` | **Totalmente simulado**: `Address` no modela ningún concepto de dirección "principal"/"predeterminada" entre varias — ningún módulo de dominio rastrea esta preferencia todavía. |
| `deliveryInstructions` | **Totalmente simulado**: `Address` es un "pure data holder" ("no geolocation, no maps, no validation, no behavior" según su propio doc de clase) — no existe campo para instrucciones de entrega. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `AddressDisplay`.

**Sin colores ni iconos en el modelo**: `AddressDisplay` no almacena
ningún `Color` ni `IconData`. `DefaultAddressBadge` resuelve su color
desde `context.colors.*` — nunca un literal suelto, siguiendo la misma
regla ya aplicada en `OrderStatusBadge`/`PaymentStatusBadge`.

## Estados visuales

`AddressManagementPage` acepta un parámetro fijo `state`
(`AddressManagementViewState`: `loading`/`empty`/`information`) — mismo
patrón que el resto de los features desde `search`. Por defecto
renderiza `information` con las 3 direcciones mock.

## Vista previa de "agregar dirección" (`AddressFormPreview`)

No existe ningún formulario funcional de creación de direcciones
todavía — `AddressFormPreview` es únicamente una maqueta visual
(campos `AppTextField` de Alias/Dirección/Ciudad/Departamento) que se
muestra siempre debajo de la lista, junto a `AddAddressButton`. Ambos
son no-op: no crean ninguna `Address` real, no hay lógica de
validación ni persistencia (a propósito, per las restricciones de este
prompt).

## Cómo conectar posteriormente

### Con Profile

`AddressDisplay.profile` ya es la entidad real `Profile` del dueño de
las direcciones — hoy el mismo mock que usa `profile` (aunque con IDs
independientes, por diseño). Cuando exista sesión real, ambos
features resolverían el mismo `Profile` autenticado, y `profile`
podría enlazar directamente a esta pantalla (además del acceso vía
`settings`).

### Con Contact

`AddressDisplay.contact` ya es la entidad real `Contact`. Hoy todas
las direcciones comparten el mismo contacto mock; cuando exista una
relación real address↔contact (o el usuario pueda elegir qué contacto
asociar a cada dirección), `AddressManagementRepository.getContactFor`
devolvería un `Contact` distinto por dirección.

### Con Request Service

`request_service` ya modela una `Address` simulada propia
(independiente) para mostrar dónde se prestaría el servicio. Cuando
exista lookup real, `request_service` podría reutilizar
`AddressManagementRepository` para dejar que el cliente elija entre sus
direcciones guardadas en vez de mostrar una fija.

### Con Orders

Ninguna `Order` referencia todavía una `Address` guardada — el dominio
`Order` no tiene un campo de dirección (la ubicación del servicio no
está modelada ahí). Cuando se agregue, `OrdersRepository` podría
resolver la `Address` real asociada a cada orden a través de este
mismo repositorio.

### Con Backend

`AddressManagementRepository` es una interfaz Dart estándar. Para
conectar datos reales:

1. Crear `ApiAddressManagementRepository implements
   AddressManagementRepository` (o
   `FirebaseAddressManagementRepository`) en `repositories/`,
   implementando cada método con una llamada HTTP real.
2. En `AddressManagementPage`, cambiar
   `MockAddressManagementRepository()` por la nueva implementación —
   es el único punto de construcción, ningún widget cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red), de que `AddressFormPreview`/
   `AddAddressButton` creen una `Address` real, y de que
   `AddressActions` ("Editar"/"Eliminar"/"Seleccionar") disparen
   mutaciones reales en vez de ser no-ops.
4. `isDefault` pasaría a ser un campo real (posiblemente en el propio
   dominio, o derivado de una preferencia de cuenta).

## Cambio mínimo en Settings

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`settings/presentation/pages/settings_page.dart`, la opción
"Direcciones" (antes no-op) ahora navega con `Navigator.push` a
`AddressManagementPage` envuelta en un `Scaffold` simple con `AppBar`
(ya que `AddressManagementPage` no construye su propio `Scaffold`).
Ninguna otra navegación fue modificada.

## Qué widgets son reutilizables

- **`DefaultAddressBadge`**: genérico (recibe `bool`), reutilizable en
  cualquier pantalla futura que necesite indicar un elemento
  "principal"/"predeterminado".
- **`AddressCard`**: composición completa de una dirección,
  reutilizable como fila de lista en cualquier pantalla que muestre
  direcciones.
- **`AddressActions`**: tres botones fijos — reutilizable donde se
  necesite exactamente ese CTA triple.
- **`AddressFormPreview`**: maqueta de formulario reutilizable como
  referencia visual para un futuro formulario real.
- **`AddressesEmptyState`**, **`AddressesLoading`**: envoltorios
  delgados sobre `AppEmptyState`/`AppLoading` — reutilizables donde se
  necesiten esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, Firebase, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, creación/
edición/eliminación real de una dirección, selección real de dirección
predeterminada, validación de formulario, lookup por ID individual.
Los botones "Editar"/"Eliminar"/"Seleccionar"/"Agregar dirección"/
"Guardar" no hacen nada más que existir visualmente. Todo el contenido
mostrado (excepto las 3 entidades de dominio compuestas y `label`
expuesto con otro nombre) es simulado, como se detalla arriba.
