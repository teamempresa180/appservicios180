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
│   └── mock_security_data.dart          Seed: Identity + 5 Authentication + 4 Credential reales
├── models/
│   └── security_display.dart             Identity + List<Authentication> + List<Credential>, todo derivado
├── repositories/
│   ├── security_repository.dart           Contrato: Identity, List<Authentication>, List<Credential>
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
        ├── credentials_section.dart
        ├── credential_card.dart
        ├── security_loading.dart
        └── security_empty_state.dart

test/features/security/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único `Identity` real y determinista, más 5
  `Authentication` reales que cubren cada valor de `AuthMethodType`
  (`password`/`biometric`/`oneTimeCode`/`thirdParty`/`other`) y cada
  valor de `AuthenticationStatus`
  (`active`/`inactive`/`locked`/`revoked`) al menos una vez, más 4
  `Credential` reales que cubren cada valor de `CredentialType`
  (`password`/`recoveryCode`/`securityKey`/`other`) y cada valor de
  `CredentialStatus` (`active`/`expired`/`revoked`) al menos una vez,
  todos prefijados `security-` — este feature muestra los métodos y
  credenciales de **una sola cuenta fija**, no hay lookup por ID ni
  login real todavía.
- **`repositories/`**: `SecurityRepository` (contrato) +
  `MockSecurityRepository`, que devuelven **únicamente entidades reales
  del dominio** (`Identity`, `Authentication`, `Credential`) — nunca
  `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `SecurityDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `SecurityPage` es el único lugar
  que instancia el repositorio y arma `SecurityDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `identity`, `authMethods`, `credentials` | Entidades **reales** del dominio (`identity/`, `authentication/`, `credentials/`), servidas por el repositorio **mock** (`MockSecurityRepository`, datos fijos en memoria). |
| Conteos por estado (`activeCount`/`inactiveCount`/`lockedCount`/`revokedCount` para métodos; `activeCredentialsCount`/`expiredCredentialsCount`/`revokedCredentialsCount` para credenciales), tipo/estado de cada registro | **Derivados, no simulados**: calculados directamente de las listas reales de `Authentication`/`Credential`. |

**No existe ningún campo simulado en este feature** — mismo criterio ya
aplicado en `schedule` (Prompt 46) y `contact_management` (Prompt 47):
los dominios `Authentication`/`Credentials` ya modelan exactamente lo
que la pantalla necesita (tipo, estado), así que no hubo ningún dato
ausente que fabricar. `Credential` únicamente referencia `IdentityId`
— nunca `Authentication` — por eso las dos listas se muestran una junto
a la otra, sin cruzarlas ni inventar una relación que el dominio no
define.

### Historial: `Credentials` como extensión planeada, no un feature nuevo

El Prompt 48 (versión original de este feature) dejó documentado aquí
mismo que *"Cuando se decida modelar el material secreto en sí,
`Credentials` se sumaría como una entidad adicional del repositorio,
sin romper el contrato actual de `SecurityRepository`"*. El Prompt 49
cumplió exactamente esa promesa: se evaluó crear un feature
`credentials` independiente, pero se descartó porque hubiera producido
una pantalla casi idéntica a esta (mismo punto de entrada en
`settings`, misma estructura visual), duplicando UI sin aportar
separación de responsabilidades real. Se extendió `security` en su
lugar — `SecurityDisplay`/`SecurityRepository`/`SecurityPage` ganaron
un campo/método/sección nuevos, sin ningún cambio de navegación (ya era
alcanzable desde "Seguridad" en `settings`).

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

El Prompt 48 (versión original de este feature) autorizó explícitamente
un único cambio, exclusivamente para poder abrir esta pantalla: en
`settings/models/settings_option.dart` se agregó
`SettingsOptionId.security` ("Seguridad", junto a "Contactos") y en
`settings/presentation/pages/settings_page.dart` se conectó esa opción
para navegar con `Navigator.push` a `SecurityPage` — el mismo patrón
que ya usan "Direcciones"/"Contactos". El Prompt 49 (extensión con
`Credentials`) **no requirió ningún cambio de navegación adicional** —
`SecurityPage` ya era alcanzable, solo ganó contenido nuevo.

## Qué widgets son reutilizables

- **`AuthMethodCard`**: genérico (recibe un `Authentication`),
  reutilizable en cualquier pantalla futura que necesite el mismo
  formato de fila tipo/estado.
- **`AuthMethodActions`**: dos botones fijos — reutilizable donde se
  necesite exactamente ese CTA doble, mismo espíritu que
  `ContactActions`.
- **`CredentialCard`**: genérico (recibe un `Credential`), mismo
  espíritu que `AuthMethodCard` pero sin acciones — este prompt no pidió
  editar/eliminar credenciales, solo mostrarlas.
- **`SecurityEmptyState`**, **`SecurityLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, login real, el secreto real detrás de cada
`Credential` (el dominio nunca lo almacena), lookup por ID. Los botones
"Agregar método"/"Desactivar"/"Eliminar" no hacen nada más que existir
visualmente; `CredentialCard` no tiene ninguna acción todavía. Todo el
contenido mostrado es real o derivado de datos reales, como se detalla
arriba.
