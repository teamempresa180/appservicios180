# Schedule

Pantalla de agenda concreta del proveedor. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications`, `reviews`, `profile`,
`settings`, `address_management`, `provider_dashboard`,
`provider_services`, `availability`, `verification` y `trust`: su
propio repositorio, sus propios datos mock, sin ninguna importación
cruzada entre features (solo `provider_dashboard` importa la
**página** de este feature para poder abrirla, ver más abajo). No
tiene `Scaffold` propio. Reutiliza exclusivamente el Design System
existente. Sin identidad visual propia — solo Material Icons.

## Diferencia con Availability

`Availability` (Prompt 43) es una declaración amplia de disponibilidad
semanal ("estoy disponible los lunes de 8 a 6"). `Schedule` es la
agenda concreta: bloques de tiempo puntuales, cada uno con su propia
fecha/hora de inicio y fin, tipo y estado — exactamente la distinción
que ya documenta el propio módulo de dominio
(`schedule/README.md`: *"`Availability` es una declaración amplia...
`Schedule` es la agenda concreta: bloques de tiempo puntuales dentro de
ese rango"*).

## Arquitectura

```
schedule/
├── README.md
├── mock/
│   └── mock_schedule_data.dart        Seed: Provider + 6 Schedule reales
├── models/
│   └── schedule_display.dart           Provider + List<Schedule>, todo derivado
├── repositories/
│   ├── schedule_repository.dart        Contrato: Provider, List<Schedule>
│   └── mock_schedule_repository.dart   Implementación en memoria
└── presentation/
    ├── pages/
    │   └── schedule_page.dart
    └── widgets/
        ├── schedule_header.dart
        ├── schedule_statistics.dart
        ├── schedule_list.dart
        ├── schedule_block_card.dart
        ├── schedule_loading.dart
        └── schedule_empty_state.dart

test/features/schedule/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único `Provider` real y determinista, más 6 bloques
  `Schedule` reales que cubren cada valor de `ScheduleStatus`
  (`open`/`blocked`/`cancelled`/`completed`) y `ScheduleType`
  (`regular`/`blocked`/`special`/`other`) al menos una vez, todos
  prefijados `schedule-` — este feature muestra la agenda de **un solo
  proveedor fijo**, no hay lookup por ID ni autenticación real todavía.
- **`repositories/`**: `ScheduleRepository` (contrato) +
  `MockScheduleRepository`, que devuelven **únicamente entidades reales
  del dominio** (`Provider`, `Schedule`) — nunca `Map<String, dynamic>`,
  `dynamic` ni JSON.
- **`models/`**: `ScheduleDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `SchedulePage` es el único lugar
  que instancia el repositorio y arma `ScheduleDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `provider`, `schedules` | Entidades **reales** del dominio (`provider/`, `schedule/`), servidas por el repositorio **mock** (`MockScheduleRepository`, datos fijos en memoria). |
| Conteos por estado (`openCount`/`blockedCount`/`cancelledCount`/`completedCount`), horas abiertas (`totalOpenDuration`), día/hora/tipo/estado de cada bloque | **Derivados, no simulados**: calculados directamente de la lista real de `Schedule` — ver la nota importante más abajo. |

**No existe ningún campo simulado en este feature** — a diferencia de
todos los features anteriores desde `service_detail`, que siempre
tuvieron al menos un campo sin equivalente real de dominio. Ver la nota
siguiente.

### Nota importante: por qué este feature no simula nada

El módulo de dominio `Schedule` ya modela exactamente lo que la
pantalla necesita mostrar: fecha/hora de inicio y fin, tipo y estado de
cada bloque. A diferencia de `Verification` (donde el prompt restringió
las entidades permitidas) o de `Trust` (donde el propio dominio carece
de lógica de cálculo y por eso `factors` quedó simulado), aquí no había
ninguna restricción ni ninguna ausencia de dato real que cubrir — todo
lo que la pantalla pide (resumen por estado, horas abiertas, listado de
bloques) es una agregación directa sobre datos 100% reales, siguiendo
el mismo patrón "derivado, no simulado" ya usado en
`OrderDisplay.scheduledDate`/`AvailabilityDisplay.activeDaysCount`,
llevado aquí a su forma más completa: cero campos fabricados.

**Sin colores ni iconos en el modelo**: `ScheduleDisplay` no almacena
ningún `Color` ni `IconData`. `ScheduleBlockCard` resuelve su color
desde `context.colors.*` — nunca un literal suelto, siguiendo la misma
regla ya aplicada en `OrderStatusBadge`/`VerificationStatusCard`/
`TrustScoreCard`.

## Estados visuales

`SchedulePage` acepta un parámetro fijo `state` (`ScheduleViewState`:
`loading`/`empty`/`information`) — mismo patrón que el resto de los
features desde `search`. Por defecto renderiza `information` con los 6
bloques mock.

## Cómo conectar posteriormente

### Con Provider Dashboard / Availability

`ScheduleDisplay.provider` hoy es un mock independiente del que usa
`provider_dashboard`/`availability`. Cuando exista sesión real, los
tres features resolverían el mismo `Provider` autenticado.

### Con Backend

`ScheduleRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiScheduleRepository implements ScheduleRepository` en
   `repositories/`, implementando cada método con una llamada HTTP
   real.
2. En `SchedulePage`, cambiar `MockScheduleRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir lookup por ID/rango de
   fechas (hoy la lista completa es fija) y sincronización con
   calendarios externos, si se decide en el futuro (ver el README del
   dominio `schedule/` para las integraciones que ya se dejaron
   preparadas sin acoplar este módulo).

## Cambio mínimo en Provider Dashboard

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_dashboard/presentation/widgets/quick_actions.dart`, se
agregó un quinto botón "Agenda" (junto a "Ver servicios"/
"Disponibilidad"/"Estadísticas"/"Configuración") que navega con
`Navigator.push` a `SchedulePage` envuelta en un `Scaffold` simple con
`AppBar` (ya que `SchedulePage` no construye su propio `Scaffold`),
siguiendo exactamente el mismo patrón usado para abrir
`AvailabilityPage`. Ninguna otra navegación fue modificada.

## Qué widgets son reutilizables

- **`ScheduleBlockCard`**: genérico (recibe un `Schedule`),
  reutilizable en cualquier pantalla futura que necesite el mismo
  formato de fila día/hora/tipo/estado, mismo espíritu que
  `DayScheduleCard` en `availability`.
- **`ScheduleEmptyState`**, **`ScheduleLoading`**: envoltorios delgados
  sobre `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten
  esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, autenticación real, lookup por ID/rango de
fechas, sincronización con calendarios externos, recurrencia
automática. Todo el contenido mostrado es real o derivado de datos
reales, como se detalla arriba.
