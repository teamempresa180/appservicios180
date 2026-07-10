# Security

Pantalla de métodos de autenticación de la cuenta. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications`, `reviews`, `profile`,
`settings`, `address_management`, `provider_dashboard`,
`provider_services`, `availability`, `verification`, `trust`,
`schedule` y `contact_management`: su propio repositorio, sus propios
datos mock, sin ninguna importación cruzada entre features (solo
`settings` importa la **página** de este feature para poder abrirla,
ver más abajo). No tiene `Scaffold` propio. Reutiliza exclusivamente el
Design System existente. Sin identidad visual propia — solo Material
Icons.

## Por qué este prompt: `Authentication` nunca se había usado

El módulo de dominio `Authentication` (asociación entre una `Identity`
y un método que puede usar para autenticarse) existe desde el inicio
del proyecto, pero ningún feature lo había usado todavía — a
diferencia de `Contact`, que al menos se usaba parcialmente dentro de
`address_management`. Este prompt le da a `Authentication` el mismo
tratamiento de primera clase que ya recibieron
`Address`/`Availability`/`Schedule`/`Contact`: una lista completa de
los métodos reales de la cuenta.

## Arquitectura

```
security/
├── README.md
├── mock/
│   └── mock_security_data.dart          Seed: Identity + 5 Authentication reales
├── models/
│   └── security_display.dart             Identity + List<Authentication>, todo derivado
├── repositories/
│   ├── security_repository.dart           Contrato: Identity, List<Authentication>
│   └── mock_security_repository.dart      Implementación en memoria
└── presentation/
    ├── pages/
    │   └── security_page.dart
    └── widgets/
        ├── security_header.dart
        ├── security_statistics.dart
        ├── auth_method_card.dart
        ├── auth_method_actions.dart
        ├── add_auth_method_button.dart
        ├── security_loading.dart
        └── security_empty_state.dart

test/features/security/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único `Identity` real y determinista, más 5
  `Authentication` reales que cubren cada valor de `AuthMethodType`
  (`password`/`biometric`/`oneTimeCode`/`thirdParty`/`other`) y cada
  valor de `AuthenticationStatus`
  (`active`/`inactive`/`locked`/`revoked`) al menos una vez, todos
  prefijados `security-` — este feature muestra los métodos de **una
  sola cuenta fija**, no hay lookup por ID ni login real todavía.
- **`repositories/`**: `SecurityRepository` (contrato) +
  `MockSecurityRepository`, que devuelven **únicamente entidades reales
  del dominio** (`Identity`, `Authentication`) — nunca
  `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `SecurityDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `SecurityPage` es el único lugar
  que instancia el repositorio y arma `SecurityDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `identity`, `authMethods` | Entidades **reales** del dominio (`identity/`, `authentication/`), servidas por el repositorio **mock** (`MockSecurityRepository`, datos fijos en memoria). |
| Conteos por estado (`activeCount`/`inactiveCount`/`lockedCount`/`revokedCount`), tipo/estado de cada método | **Derivados, no simulados**: calculados directamente de la lista real de `Authentication`. |

**No existe ningún campo simulado en este feature** — mismo criterio ya
aplicado en `schedule` (Prompt 46) y `contact_management` (Prompt 47):
el dominio `Authentication` ya modela exactamente lo que la pantalla
necesita (tipo de método, estado), así que no hubo ningún dato ausente
que fabricar. **No se usa el módulo `Credentials`**: `Authentication`
dice qué método existe; `Credentials` representaría el material
secreto asociado — este feature no necesita ni expone secretos, solo
la lista de métodos disponibles, así que `Credentials` queda fuera de
alcance intencionalmente.

**Sin colores ni iconos en el modelo**: `SecurityDisplay` no almacena
ningún `Color` ni `IconData`. `AuthMethodCard` resuelve su ícono (por
tipo) y su color de estado desde `Icons.*`/`context.colors.*` — nunca
un literal suelto, siguiendo la misma regla ya aplicada en
`OrderStatusBadge`/`ContactCard`/`ScheduleBlockCard`.

## Estados visuales

`SecurityPage` acepta un parámetro fijo `state` (`SecurityViewState`:
`loading`/`empty`/`information`) — mismo patrón que el resto de los
features desde `search`. Por defecto renderiza `information` con los 5
métodos mock.

## Cómo conectar posteriormente

### Con Credentials

Cuando se decida modelar el material secreto en sí (Prompt futuro),
`Credentials` se sumaría como una entidad adicional del repositorio, sin
romper el contrato actual de `SecurityRepository`.

### Con Backend

`SecurityRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiSecurityRepository implements SecurityRepository` en
   `repositories/`, implementando cada método con una llamada HTTP
   real.
2. En `SecurityPage`, cambiar `MockSecurityRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de que "Agregar método"/"Desactivar"/
   "Eliminar" disparen operaciones reales (incluyendo un flujo real de
   verificación) en vez de ser no-ops.

## Cambio mínimo en Settings

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en `settings/models/settings_option.dart`
se agregó `SettingsOptionId.security` ("Seguridad", junto a
"Contactos") y en
`settings/presentation/pages/settings_page.dart` se conectó esa opción
para navegar con `Navigator.push` a `SecurityPage` — el mismo patrón
que ya usan "Direcciones"/"Contactos". Ninguna otra navegación fue
modificada.

## Qué widgets son reutilizables

- **`AuthMethodCard`**: genérico (recibe un `Authentication`),
  reutilizable en cualquier pantalla futura que necesite el mismo
  formato de fila tipo/estado.
- **`AuthMethodActions`**: dos botones fijos — reutilizable donde se
  necesite exactamente ese CTA doble, mismo espíritu que
  `ContactActions`.
- **`SecurityEmptyState`**, **`SecurityLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, login real, material secreto (`Credentials`),
lookup por ID. Los botones "Agregar método"/"Desactivar"/"Eliminar" no
hacen nada más que existir visualmente. Todo el contenido mostrado es
real o derivado de datos reales, como se detalla arriba.
