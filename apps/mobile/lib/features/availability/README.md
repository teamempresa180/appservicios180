# Availability

Pantalla de gestión del horario semanal de un proveedor. **Completamente
independiente** de `marketplace`, `categories`, `search`, `home`,
`service_detail`, `provider_profile`, `request_service`, `quote`,
`orders`, `payments`, `chat`, `notifications`, `reviews`, `profile`,
`settings`, `address_management`, `provider_dashboard` y
`provider_services`: su propio repositorio, sus propios datos mock,
sin ninguna importación cruzada entre features (solo
`provider_dashboard` importa la **página** de este feature para poder
abrirla, ver más abajo). No tiene `Scaffold` propio. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia
— solo Material Icons.

## Arquitectura

```
availability/
├── README.md
├── mock/
│   └── mock_availability_data.dart       Seed: Provider + 7 Availability reales (una por día, Lunes-Domingo) + próxima disponibilidad/horario simulados
├── models/
│   └── availability_display.dart         Provider + List<Availability> + campos simulados/derivados
├── repositories/
│   ├── availability_repository.dart       Contrato: Provider, List<Availability>
│   └── mock_availability_repository.dart  Implementación en memoria
└── presentation/
    ├── pages/
    │   └── availability_page.dart
    └── widgets/
        ├── availability_header.dart
        ├── weekly_schedule.dart
        ├── day_schedule_card.dart
        ├── time_slot.dart
        ├── availability_statistics.dart
        ├── availability_actions.dart
        ├── availability_loading.dart
        ├── availability_empty_state.dart
        └── save_availability_button.dart

test/features/availability/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: 7 `Availability` reales y deterministas, prefijadas
  `availability-`, una por cada día de la semana (Lunes a Viernes
  activas de 8:00 a 18:00, Sábado activa de 9:00 a 14:00, Domingo
  inactiva), compartiendo un único `Provider` ("Diana") — este feature
  muestra un **horario fijo**, no hay lookup por ID todavía.
- **`repositories/`**: `AvailabilityRepository` (contrato) +
  `MockAvailabilityRepository`, que devuelven **únicamente entidades
  reales del dominio** (`Provider`, `Availability`) — nunca
  `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `AvailabilityDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `AvailabilityPage` es el único
  lugar que instancia el repositorio y arma `AvailabilityDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `provider`, `availabilities` | Entidades **reales** del dominio (`provider/`, `availability/`), servidas por el repositorio **mock** (`MockAvailabilityRepository`, datos fijos en memoria). |
| Día de la semana de cada tarjeta | **Derivado**, no simulado ni fabricado: se obtiene de `Availability.availableFrom.weekday`, el campo real del dominio — no existe un campo simulado separado de "día". Ver `mock_availability_data.dart`: cada registro usa una fecha base conocida (2024-01-01, lunes) más un offset de días, exclusivamente para codificar el día de la semana en un campo ya real. |
| "Disponible"/"No disponible" por día | **Derivado** de `Availability.status` real (`active`/`inactive`) — no simulado. |
| "Hora inicio"/"Hora fin" por día | **Reales, no fabricados**: passthrough directo de `Availability.availableFrom`/`Availability.availableTo`. |
| `activeDaysCount`, `inactiveDaysCount`, `weeklyAvailabilityPercentage` | **Derivados**, no simulados: contados/calculados directamente de los 7 `Availability.status` reales. El prompt los listó como campos simulados, pero aquí se documenta que son derivables de entidades ya reales — mismo criterio ya usado en `OrderDisplay.scheduledDate`, `AddressDisplay.label` y `ProviderServiceDisplay.isPublished`. |
| `nextAvailableLabel` | **Totalmente simulado**: no existe lógica de calendario/tiempo real que calcule un próximo espacio disponible genuino a partir de los 7 registros semanales. |
| `workingHoursLabel` | **Totalmente simulado**: un resumen de una sola línea de "horario laboral" requeriría agregar las horas de cada día en una sola oración legible — esa lógica de agregación no existe todavía, así que es una etiqueta de marcador de posición. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `AvailabilityDisplay`.

**Sin colores ni iconos en el modelo**: `AvailabilityDisplay` no
almacena ningún `Color` ni `IconData`. `DayScheduleCard`/`TimeSlot`
resuelven íconos y colores desde `Availability.status` +
`context.colors.*` — nunca un literal suelto, siguiendo la misma regla
ya aplicada en `OrderStatusBadge`/`ServiceStatusBadge`.

## Estados visuales

`AvailabilityPage` acepta un parámetro fijo `state`
(`AvailabilityViewState`: `loading`/`empty`/`information`) — mismo
patrón que el resto de los features desde `search`. Por defecto
renderiza `information` con el horario semanal mock.

## Cómo conectar posteriormente

### Con Provider Dashboard

`ProviderDashboardDisplay` no compone `Availability` directamente
todavía. Cuando exista lookup por ID compartido, `ProviderPerformance`
o una nueva sección del dashboard podrían mostrar un resumen de
disponibilidad enlazando aquí.

### Con Provider Services

Cada `Service` en `provider_services` podría eventualmente asociarse a
una ventana de disponibilidad real (p. ej. un servicio "exprés" solo
disponible en ciertos horarios). Hoy ambos features son independientes
por diseño — no existe esa relación todavía.

### Con Request Service

`request_service` ya muestra un `ScheduleSelector` simulado
(fecha/hora) independiente de cualquier disponibilidad real del
proveedor. Cuando exista lookup compartido, ese selector debería
restringirse a los horarios reales que este feature gestiona, en vez
de aceptar cualquier fecha/hora.

### Con Backend

`AvailabilityRepository` es una interfaz Dart estándar. Para conectar
datos reales:

1. Crear `ApiAvailabilityRepository implements AvailabilityRepository`
   en `repositories/`, implementando cada método con una llamada HTTP
   real.
2. En `AvailabilityPage`, cambiar `MockAvailabilityRepository()` por
   la nueva implementación — es el único punto de construcción,
   ningún widget cambia.
3. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `AvailabilityActions`/
   `SaveAvailabilityButton` disparen mutaciones reales (editar/copiar/
   limpiar/guardar horario) en vez de ser no-ops.
4. `nextAvailableLabel`/`workingHoursLabel` se conectarían a un futuro
   endpoint de agregación de horarios/calendario.

## Cambio mínimo en Provider Dashboard

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_dashboard/presentation/pages/provider_dashboard_page.dart`,
el botón "Disponibilidad" de `QuickActions` (antes no-op) ahora navega
con `Navigator.push` a `AvailabilityPage` envuelta en un `Scaffold`
simple con `AppBar` (ya que `AvailabilityPage` no construye su propio
`Scaffold`) — el mismo patrón que `provider_services` usó para abrirse
desde `provider_dashboard`. Los otros dos botones
("Estadísticas"/"Configuración") siguen siendo no-op. Ninguna otra
navegación fue modificada.

## Qué widgets son reutilizables

- **`TimeSlot`**: genérico (recibe `Availability`), reutilizable en
  cualquier pantalla futura que necesite mostrar un rango de horas de
  un registro real.
- **`DayScheduleCard`**: composición completa de un día, reutilizable
  como fila de lista en cualquier pantalla que muestre horarios
  semanales.
- **`AvailabilityActions`**: tres botones fijos — reutilizable donde se
  necesite exactamente ese CTA triple.
- **`SaveAvailabilityButton`**: envoltorio delgado sobre `AppButton`
  con el label fijo "Guardar disponibilidad".
- **`AvailabilityEmptyState`**, **`AvailabilityLoading`**: envoltorios
  delgados sobre `AppEmptyState`/`AppLoading` — reutilizables donde se
  necesiten esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, edición/
copiado/limpiado/guardado real de un horario, cálculo real de próxima
disponibilidad, agregación real de horario laboral en una sola
etiqueta, lookup por ID individual. Los botones "Editar horario"/
"Copiar horario"/"Limpiar horario"/"Guardar disponibilidad" no hacen
nada más que existir visualmente. Todo el contenido mostrado (excepto
las 2 entidades de dominio compuestas y los campos derivados) es
simulado, como se detalla arriba.
