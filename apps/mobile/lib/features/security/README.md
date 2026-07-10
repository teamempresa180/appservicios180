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
│   └── mock_security_data.dart          Seed: Identity + 5 Authentication + 4 Credential + 5 Audit reales
├── models/
│   └── security_display.dart             Identity + List<Authentication> + List<Credential> + List<Audit>, todo derivado
├── repositories/
│   ├── security_repository.dart           Contrato: Identity, List<Authentication>, List<Credential>, List<Audit>
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
        ├── audit_log_section.dart
        ├── audit_log_entry_card.dart
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
  más 5 `Audit` reales que cubren la mayoría de valores de
  `AuditActionType` relevantes a seguridad
  (`loggedIn`/`updated`/`created`/`deleted`/`loggedOut`), todos
  prefijados `security-` — este feature muestra los métodos,
  credenciales y actividad de **una sola cuenta fija**, no hay lookup
  por ID ni login real todavía.
- **`repositories/`**: `SecurityRepository` (contrato) +
  `MockSecurityRepository`, que devuelven **únicamente entidades reales
  del dominio** (`Identity`, `Authentication`, `Credential`, `Audit`) —
  nunca `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `SecurityDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `SecurityPage` es el único lugar
  que instancia el repositorio y arma `SecurityDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `identity`, `authMethods`, `credentials`, `auditLog` | Entidades **reales** del dominio (`identity/`, `authentication/`, `credentials/`, `audit/`), servidas por el repositorio **mock** (`MockSecurityRepository`, datos fijos en memoria). |
| Conteos por estado (`activeCount`/`inactiveCount`/`lockedCount`/`revokedCount` para métodos; `activeCredentialsCount`/`expiredCredentialsCount`/`revokedCredentialsCount` para credenciales), tipo/estado de cada registro, descripción/fecha de cada entrada de auditoría | **Derivados o passthrough directo, no simulados**: los conteos se calculan directamente de las listas reales de `Authentication`/`Credential`; `sortedAuditLog` solo ordena `auditLog` por `occurredAt` — `Audit.description` es texto real del dominio, nunca fabricado. |

**No existe ningún campo simulado en este feature** — mismo criterio ya
aplicado en `schedule` (Prompt 46) y `contact_management` (Prompt 47):
los dominios `Authentication`/`Credentials`/`Audit` ya modelan
exactamente lo que la pantalla necesita (tipo, estado, descripción),
así que no hubo ningún dato ausente que fabricar. `Credential`/`Audit`
únicamente referencian `IdentityId` — nunca `Authentication` — por eso
las tres listas se muestran una junto a la otra, sin cruzarlas ni
inventar una relación que el dominio no define.

### Historial: `Credentials` y `Audit`, extensiones planeadas, no features nuevos

El Prompt 48 (versión original de este feature) dejó documentado aquí
mismo que *"Cuando se decida modelar el material secreto en sí,
`Credentials` se sumaría como una entidad adicional del repositorio,
sin romper el contrato actual de `SecurityRepository`"*. El Prompt 49
cumplió exactamente esa promesa. El Prompt 50 siguió el mismo criterio
con `Audit`: de los tres módulos de dominio que ningún feature usaba
todavía (`Audit`, `Attachment`, `Message`), `Message` ya estaba resuelto
por `chat` desde su construcción original; entre `Audit` y `Attachment`
se eligió `Audit` porque encaja naturalmente como "Actividad reciente
de la cuenta" junto a `Authentication`/`Credentials`, sin necesidad de
un feature nuevo (`Audit` únicamente referencia `IdentityId`, mismo
patrón que `Credential`). `Attachment` queda documentado como
oportunidad futura para `chat` (ver la sección de revisión
arquitectónica del handoff de esa sesión), no descartado, solo no
elegido para este prompt. En ambos casos, se evaluó crear un feature
independiente y se descartó porque hubiera producido una pantalla casi
idéntica a esta (mismo punto de entrada en `settings`, misma estructura
visual), duplicando UI sin aportar separación de responsabilidades
real. Se extendió `security` en su lugar en ambas ocasiones —
`SecurityDisplay`/`SecurityRepository`/`SecurityPage` ganaron un
campo/método/sección nuevos cada vez, sin ningún cambio de navegación
(ya era alcanzable desde "Seguridad" en `settings`).

**Sin colores ni iconos en el modelo**: `SecurityDisplay` no almacena
ningún `Color` ni `IconData`. `AuthMethodCard` resuelve su ícono (por
tipo) y su color de estado desde `Icons.*`/`context.colors.*` — nunca
un literal suelto, siguiendo la misma regla ya aplicada en
`OrderStatusBadge`/`ContactCard`/`ScheduleBlockCard`.

## Estados visuales

`SecurityPage` acepta un parámetro fijo `state` (`SecurityViewState`:
`loading`/`empty`/`information`) — mismo patrón que el resto de los
features desde `search`. Por defecto renderiza `information` con los 5
métodos, 4 credenciales y 5 entradas de auditoría mock.

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
4. Cada acción real (crear/editar/eliminar un método o credencial,
   inicio/cierre de sesión) sería el disparador natural para generar un
   nuevo registro real de `Audit` — hoy `mockAuditLog` es fijo, sin
   ninguna lógica que lo actualice.

## Cambio mínimo en Settings

El Prompt 48 (versión original de este feature) autorizó explícitamente
un único cambio, exclusivamente para poder abrir esta pantalla: en
`settings/models/settings_option.dart` se agregó
`SettingsOptionId.security` ("Seguridad", junto a "Contactos") y en
`settings/presentation/pages/settings_page.dart` se conectó esa opción
para navegar con `Navigator.push` a `SecurityPage` — el mismo patrón
que ya usan "Direcciones"/"Contactos". Los Prompts 49 (extensión con
`Credentials`) y 50 (extensión con `Audit`) **no requirieron ningún
cambio de navegación adicional** — `SecurityPage` ya era alcanzable,
solo ganó contenido nuevo cada vez.

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
- **`AuditLogEntryCard`**: genérico (recibe un `Audit`), reutilizable en
  cualquier pantalla futura que necesite el mismo formato de fila
  ícono/descripción/fecha, sin badge de estado porque `Audit` no tiene
  `status`.
- **`SecurityEmptyState`**, **`SecurityLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, login real, el secreto real detrás de cada
`Credential` (el dominio nunca lo almacena), generación real de nuevas
entradas de `Audit` (el log mock es fijo), lookup por ID. Los botones
"Agregar método"/"Desactivar"/"Eliminar" no hacen nada más que existir
visualmente; `CredentialCard`/`AuditLogEntryCard` no tienen ninguna
acción todavía. Todo el contenido mostrado es real o derivado de datos
reales, como se detalla arriba.
