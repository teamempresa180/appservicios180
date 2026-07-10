# AppServicios — Estado del Proyecto (Session Handoff)

> Este documento existe para que cualquier sesión futura (con Claude o con
> otra persona) pueda retomar el proyecto sin depender de leer toda la
> conversación anterior. Léelo junto con la memoria persistente del asistente
> (`MEMORY.md`, fuera de este repo) antes de continuar.

## 1. Resumen ejecutivo

AppServicios es una plataforma de servicios tipo "Uber de servicios"
(clientes ↔ proveedores), compuesta por:

- **Backend**: NestJS, arquitectura DDD + Clean Architecture, monorepo
  modular por Bounded Context.
- **Frontend**: Flutter, con un Design System propio (`core/ui`) y
  navegación base (`core/navigation`) ya construidos.

El proyecto se construyó siguiendo una secuencia estricta de fases: primero
todo el **Domain** puro (23 módulos), luego una **Auditoría Arquitectónica**,
luego documentos de **Arquitectura Funcional** y **Arquitectura Táctica
(DDD)**, luego el **Shared Kernel**, luego la capa **Application** completa,
luego la capa **Presentation (REST)** completa, y ahora se está construyendo
el **Frontend Flutter** paso a paso.

**No existe todavía**: persistencia real, ninguna base de datos conectada,
autenticación real (JWT/OAuth), ninguna integración externa (pagos, mapas,
Firebase, IA), y **no existe identidad visual oficial** (sin logo, sin
colores de marca, sin tipografía corporativa) — esto es una decisión
explícita y documentada, no un olvido.

## 2. Arquitectura

- **DDD táctico**: 22 Aggregate Roots (uno por módulo de negocio) + `Core`
  como shared kernel. Cada aggregate = una entidad + sus propios value
  objects; nunca contiene entidades de otro módulo (solo IDs).
- **7 Bounded Contexts**: Identity & Access, Trust & Compliance,
  Marketplace, Fulfillment, Payments, Reputation, Communication.
- **Capas por módulo**: `domain/` (completo, dominio puro) →
  `application/` (completo, esqueleto sin lógica) → `infrastructure/`
  (vacía, reservada) → `presentation/` (completo, REST sin lógica).
- Documentos de referencia ya generados en la conversación (no como
  archivos, quedaron en el historial de chat): Auditoría Arquitectónica 1.0,
  Arquitectura Funcional, Arquitectura Táctica DDD, Shared Kernel
  (Money/Timestamp — **documentado pero aún NO implementado en código**).

## 3. Estado del Backend (`apps/backend`)

### Domain — ✅ 100% completo (23 módulos)
Core, Identity, Profiles, Verification, Trust, Audit, Authentication,
Credentials, Contact, Address, Provider, Category, Service, Order, Quote,
Payment, Review, Availability, Schedule, Notification, Chat, Message,
Attachment.

Cada uno con: entidad, value objects, interfaz de repositorio, tests
(Jest). **113 tests pasando, 51 suites.**

### Application — ✅ 100% completo (22 módulos de negocio, sin Core)
Cada módulo tiene `application/{commands,queries,use_cases,dto,mappers}/`.
Los Use Cases tienen el repositorio inyectado por constructor pero
`execute()` siempre lanza `Error("Not implemented yet")` — es
intencional, no un bug.

### Presentation — ✅ 100% completo (22 controllers REST)
Cada módulo tiene `presentation/{controllers,routes,swagger}/` +
`<módulo>.module.ts`. Todos registrados en `AppModule`. Swagger disponible
en `/docs` (`@nestjs/swagger` instalado). Los Use Cases se inyectan vía
`useFactory` con el repositorio como `undefined` (placeholder explícito,
documentado en cada `*.module.ts`) — **no existe ninguna implementación de
repositorio ni conexión a base de datos todavía**.

### Infrastructure — ❌ No iniciada (carpetas vacías, reservadas)

### Verificación backend (último estado conocido)
```
npm run build   ✅
npm run lint    ✅ 0 errores, 0 warnings
npx jest        ✅ 51/51 suites, 113/113 tests
```

## 4. Estado de Flutter (`apps/mobile`)

### Domain — ✅ 100% completo (mismo modelo que backend, en Dart)
Mismos 23 conceptos, en `lib/<módulo>/{models,entities}/`.

### Core UI (Design System) — ✅ completo y refinado (`lib/core/ui/`)
- `theme/app_theme.dart`: paleta 100% neutra (`AppColors`: background
  `#FFFFFF`, surface `#F8F8F8`, divider `#E5E5E5`, texto primario
  `#111111`, texto secundario `#666666`, error `#B00020`). Tipografía:
  Roboto (fuente del sistema, sin assets). `inputDecorationTheme` con
  bordes distintos por estado (focus/error/disabled).
- `tokens/`: spacing, radius, elevation (ahora consumido por `AppCard`),
  durations.
- `widgets/`: `AppButton` (estados normal/pressed/disabled/loading,
  altura uniforme, `AnimatedSwitcher`), `AppTextField` (prefix/suffix
  icon), `AppCard` (elevación sutil), `AppLoading` (Material 3
  `strokeCap.round`), `AppEmptyState` (acción opcional vía `AppButton`),
  `AppDivider`, `AppSectionTitle` (subtítulo + acción "Ver todo"
  opcionales), `AppScaffold`.
- `animations/`: FadeIn, ScaleIn, SlideIn (sin Lottie/Rive) — únicas
  animaciones permitidas en toda la app.
- `icons/`: AppIcons (solo Material Icons).
- `extensions/`: helpers de tema y espaciado.
- **Bug corregido (Prompt 29)**: `AppButton(expand: false)` crasheaba
  ("BoxConstraints forces an infinite width") dentro de `Row`/`Wrap`/etc.
  Causa: `minimumSize: Size.fromHeight(48)` fijaba el ancho mínimo en
  infinito. Corregido a `Size(0, 48)`. Verificado en Column, Row, Wrap,
  Card, ListView, GridView, Dialog, BottomSheet, AppBar actions.

### Navegación + Splash — ✅ completo (`lib/core/navigation/` + `lib/features/`)
- `GoRouter` configurado en `core/navigation/router/app_router.dart`.
- Rutas registradas: `/` (Splash), `/onboarding`, `/login`, `/register`,
  `/select-role`, `/home` (ahora renderiza `AppShellPage`, no un
  placeholder suelto).
- `guards/app_route_guard.dart`: guard "siempre permite", punto de
  extensión para autenticación futura (no implementada).
- Navegación **dentro** del Shell y entre features de exploración
  (Marketplace → Service Detail → Provider Profile) usa `Navigator.push`
  local, no `GoRouter` — documentado en cada README de feature afectado.

### Features construidos (Prompts 19–30), todos 100% visuales/mock — sin backend

| # | Feature | Contenido |
|---|---|---|
| 19 | `onboarding` | 3 slides, sin persistencia de "ya visto". |
| 20 | `login` | Formulario funcional visualmente, validación local, sin auth real. |
| 21 | `register` + `select_role` | Registro + selección Cliente/Proveedor, ambos simulados. |
| 22–23 | `app_shell` | Shell reutilizable: `AppTopBar` + `IndexedStack` (5 slots: Inicio, Buscar, Órdenes, Mensajes, Perfil) + `AppBottomNavigation`/`AppNavigationRail` responsivo. |
| 24 | `home` | Home único adaptable a rol (Cliente/Proveedor) vía `MockUserRole`, vive en el slot "Inicio" del Shell. |
| 25 | — | Sprint de refinamiento visual del Design System (ver arriba). |
| 26 | `marketplace` | Categorías, servicios destacados, proveedores recomendados — vive en el slot "Buscar" del Shell. `MockCategoryRepository`/`MockServiceRepository`/`MockProviderRepository`. |
| 27 | `categories` | Grid responsivo de 12 categorías, independiente de `marketplace`. `MockCategoryRepository` propio. |
| 28 | `search` | Buscador visual (acepta escritura, sin búsqueda real), 4 estados (loading/empty/results/noResults). `MockSearchRepository`. |
| 29 | `service_detail` | Detalle de un servicio fijo simulado: galería, descripción, proveedor, categoría, reseñas. Abierto desde `marketplace`/`search` (`Navigator.push`). `MockServiceDetailRepository`. |
| 30 | `provider_profile` | Perfil de un proveedor fijo simulado: portada, avatar, estadísticas, especialidades, servicios, disponibilidad, reseñas. Abierto desde `service_detail`. `MockProviderProfileRepository`. |

Patrón repetido en cada feature de datos (26–30): `presentation/`
(pages + widgets, sin `Scaffold` propio) + `models/` (composición de
presentación tipada, p. ej. `ServiceDisplay`, `ServiceDetailData`,
`ProviderProfileData` — nunca `Map<String, dynamic>` ni `dynamic`) +
`repositories/` (contrato abstracto + `Mock*Repository`) + `mock/`
(datos semilla con entidades reales de dominio, IDs deterministas) +
`README.md` propio explicando qué es real/derivado/simulado y cómo
reemplazar el mock por un repositorio real.

### Features construidos (Prompts 31–42), mismo patrón que 26–30 — todos 100% visuales/mock, sin backend

| # | Feature | Contenido | Abierto desde |
|---|---|---|---|
| 31 | `request_service` | Formulario de solicitud de servicio: fecha, hora, dirección, descripción, adjuntos simulados, prioridad. | `provider_profile` ("Solicitar servicio"). |
| 32 | `quote` | Cotización: resumen de servicio/proveedor/dirección/horario, desglose de precio, notas. | `request_service` ("Continuar"). |
| 33 | `orders` | Lista de órdenes con 4 estados (Pendiente/En progreso/Finalizada/Cancelada), tabs de filtro puramente visuales. | `quote` ("Confirmar solicitud"). |
| 34 | `payments` | Detalle de un pago: método, estado, resumen, desglose. | `orders` ("Ver detalle"). |
| 35 | `chat` | Conversación simulada cliente↔proveedor (4 mensajes alternados), input visual no-op. | `payments` ("Ver recibo"). |
| 36 | `notifications` | Centro de notificaciones con 5 categorías (orden/pago/cotización/mensaje/sistema), tabs de filtro visuales. | `chat` ("Más opciones"). |
| 37 | `reviews` | Lista de reseñas con calificación por estrellas, filtros por rating (visuales). | `orders` ("Calificar", especificado explícitamente por el prompt). |
| 38 | `profile` | Perfil de cuenta del cliente: información personal, contacto, dirección, progreso de perfil. | Slot "Perfil" del `AppShell` (antes `ShellPlaceholder`). |
| 39 | `settings` | Menú de configuración (Direcciones/Notificaciones/Privacidad/Ayuda/Cerrar sesión). **Insertado** antes del Prompt 40 porque ese prompt asumía su existencia y no había sido construido — confirmado con el usuario antes de proceder. | Ícono de engranaje en `ProfileHeader` (`profile`). |
| 40 | `address_management` | Gestión de direcciones guardadas (Casa/Trabajo/Oficina), acciones Editar/Eliminar/Seleccionar no-op. | `settings` ("Direcciones"). |
| 41 | `provider_dashboard` | Panel del proveedor: ganancias (simuladas), estadísticas de órdenes (derivadas), rendimiento, órdenes recientes/pendientes, acciones rápidas. | `ProfileActions` ("Panel del proveedor", botón agregado). |
| 42 | `provider_services` | Administración de servicios publicados: estadísticas activos/pausados (derivadas de `Service.status`), lista de servicios, acciones Editar/Pausar/Eliminar no-op. | `provider_dashboard` ("Ver servicios"). |
| 43 | `availability` | Horario semanal del proveedor (Lunes–Domingo): 7 `Availability` reales (una por día), disponible/no disponible y horas derivados de `Availability.status`/`availableFrom`/`availableTo`, estadísticas derivadas + próxima disponibilidad simulada, acciones Editar/Copiar/Limpiar horario no-op. | `provider_dashboard` ("Disponibilidad"). |
| 44 | `verification` | Verificación de identidad: `Identity`/`Profile` reales (una cuenta fija), nombre completo/tipo de documento reales (passthrough), `verificationStatus`/`completedSteps`/`pendingSteps`/`rejectedReason`/`estimatedReviewTime` totalmente simulados (el módulo de dominio `Verification` existe pero el prompt no lo incluyó en el contrato del repositorio — documentado explícitamente en el README como excepción al patrón "derivado, no simulado"), selfie simulada, 3 estados visuales (loading/empty/information). | `provider_profile` (tercer botón "Verificación", agregado junto a "Solicitar servicio"/"Chat"). |

Mismo patrón exacto que 26–30 en los 13 features nuevos (31–43):
`presentation/` + `models/` (composición tipada) +
`repositories/`(contrato + `Mock*Repository`) + `mock/` + `README.md`
propio. Criterio nuevo, aplicado consistentemente desde el Prompt 31:
cuando el prompt pide un campo "simulado" que en realidad ya tiene un
equivalente real en el dominio (p. ej. `OrderDisplay.scheduledDate` ←
`Order.scheduledDate`, `ProviderServiceDisplay.isPublished` ←
`Service.status == active`), se expone como **getter derivado/real**
en vez de fabricar un segundo valor inconsistente — documentado
explícitamente en cada README y en el doc de cada clase de modelo.

### Verificación Flutter (último estado conocido — Prompt 30 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 333/333 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 42 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 613/613 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 43 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 635/635 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 44 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 656/656 tests
flutter run -d windows    ✅ compila y corre sin errores
```

**Nota de entorno**: el problema del carácter `°` (que afectaba
`flutter analyze`/`flutter build windows` en la ruta antigua bajo
`Grupo empresarial 180°`) **no existe** en la ruta oficial
`C:\dev\AppServicios_nuevo` — no hace falta ningún workaround.

**Nota sobre el dispositivo físico**: en las últimas sesiones el
Realme RMX3938 no estaba conectado al momento de verificar; se usó
`flutter run -d windows` como alternativa. Verificar en el dispositivo
físico sigue pendiente como buena práctica, no es bloqueante.

### Lo que NO existe todavía en Flutter
Gestión de estado (Provider/Riverpod/Bloc/Cubit/ViewModels), consumo de
API, conexión a backend, autenticación real, persistencia, identidad
visual real. Toda navegación entre features de exploración/flujo
(`marketplace`→`service_detail`→`provider_profile`→`request_service`→
`quote`→`orders`→`payments`→`chat`→`notifications`, `orders`→`reviews`,
`profile`→`settings`→`address_management`, `profile`→
`provider_dashboard`→`provider_services`) es `Navigator.push` puntual,
no rutas de `GoRouter` registradas — ningún feature de datos tiene
lookup por ID todavía (cada uno muestra un único registro fijo
simulado, o una lista fija en los features que ya muestran varios
registros: `orders`, `notifications`, `reviews`,
`address_management`, `provider_services`).

**Actualización (Prompts 31–42)**: `Chat`, `Quotes`, `Orders` y
`Payments` **ya existen como features 100% visuales/mock** (`chat`,
`quote`, `orders`, `payments`) — lo que sigue sin existir es su
conexión a backend/lógica real, no la pantalla en sí. Ver la tabla de
features arriba.

**Actualización (Prompt 44)**: `Verification` ya existe como feature
100% visual/mock (`verification`), abierto desde `provider_profile`
(tercer botón "Verificación"). El módulo de dominio real `Verification`
existe (ver sección 3) pero **no se usa** en este feature — el prompt
restringió el repositorio a `Identity`/`Profile` únicamente, por lo que
`verificationStatus` y campos relacionados siguen siendo simulados en
sentido estricto (no derivados), a diferencia del patrón usado en
`orders`/`provider_services`/`availability`. Ver el README de
`features/verification/` para el detalle completo de esta excepción
documentada.

## 5. Decisiones arquitectónicas importantes

- **Regla de oro repetida en los 23 módulos**: un módulo solo referencia a
  otro por su ID (`XId`), nunca importa la entidad completa.
- **Aggregate = módulo**: no hay entidades anidadas dentro de otro
  aggregate; cada uno de los 22 módulos de negocio es su propio Aggregate
  Root.
- **Invariantes cruzadas** (p. ej. "una Order solo acepta una Quote") están
  documentadas pero **no implementadas** — vivirán en Domain
  Services/Application cuando se construya la lógica real.
- **Shared Kernel `Money`/`Timestamp`/`Currency`/`DateRange`**: especificados
  en el documento correspondiente pero **aún no creados como código**. Son
  la primera tarea recomendada antes de tocar Payment/Quote/Service con
  lógica real.
- **Use Cases placeholder**: todos lanzan `"Not implemented yet"` a
  propósito — es la señal de que la lógica de negocio real todavía no
  existe, en ningún módulo.

## 6. Decisiones de UI

- Paleta neutra fija (ver sección 4) — **no cambiar sin aprobación
  explícita del usuario**, ya que la ausencia de marca es intencional.
- Todo widget de negocio debe reutilizar `core/ui`, nunca definir colores o
  paddings sueltos.
- Toda navegación pasa por `AppRoutes` (constantes) + `AppRouter` — nunca
  strings de ruta sueltos.

## 7. Branding (pendiente — Sprint de Branding, sin número de prompt fijo asignado todavía)

**No existe identidad visual oficial todavía.** No crear/usar logo,
colores de marca (negro/dorado/blanco), tipografía corporativa ni
iconografía propia hasta ese sprint dedicado. Cuando llegue, el único
archivo a tocar es `lib/core/ui/theme/app_theme.dart` (ver su propio
README para el procedimiento).

**Archivo `Logo oficial grupo.svg`**: existe en la raíz del repositorio
(`C:\dev\AppServicios_nuevo\Logo oficial grupo.svg`), colocado ahí por
el usuario en preparación para el Sprint de Branding. **No fue creado
por el asistente, sigue sin estar en ningún commit (permanece
untracked a propósito), no se usa ni se referencia en ningún widget.**
No moverlo, no tocarlo, no agregarlo a assets. Reconfirmado intacto en
el Sprint de Consolidación posterior al Prompt 42 — sigue reservado
exclusivamente para el Sprint de Branding, todavía no programado con
un número de prompt fijo.

## 8. Cómo ejecutar

### Backend
```
cd apps/backend
npm install
npm run start:dev
# Swagger disponible en http://localhost:3000/docs
```

### Flutter
```
cd apps/mobile
flutter pub get
flutter run -d <device>
# Dispositivo físico verificado: Realme RMX3938 (Android 16, API 36)
# También funciona en: flutter run -d windows
```

## 9. Último prompt completado

**Prompt 30 — Feature Provider Profile (visual completo)**. **Aprobado
por el usuario.** Completado y verificado (`flutter analyze`,
`flutter test` 333/333, `flutter run -d windows`). Working tree sin
commit al momento de aprobarse — ver sección "Estado del repositorio al
cierre de esta sesión" más abajo para el commit de continuidad.

### Actualización — Prompt 42 completado (sesión posterior)

**Prompt 42 — Feature Provider Services (visual completo)**, último de
una racha continua de 12 prompts (31 a 42) construidos en la misma
sesión siguiendo exactamente el patrón de `service_detail`/
`provider_profile`. Todos entregados con el formato estándar (qué se
implementó, árbol, widgets, repository, modelo, responsive,
`flutter analyze`, `flutter test`, `flutter run`, `git status`,
confirmación sin backend) y todos aprobados por el usuario antes de
avanzar al siguiente. Ver la tabla de features en la sección 4 para el
detalle de cada uno, incluyendo el Prompt 39 (`settings`) insertado
fuera de la numeración original del usuario porque el Prompt 40
(`address_management`) asumía su existencia.

Sprint de Consolidación ejecutado inmediatamente después del Prompt 42
(sin desarrollar features nuevos): auditoría de `git status`,
actualización de este documento, commit único de consolidación y
re-verificación de `flutter analyze`/`flutter test`. Ver la sección de
cierre de sesión más abajo para el hash del commit.

### Actualización — Prompt 43 completado y consolidado

**Prompt 43 — Feature Availability (visual completo)**. **Aprobado por
el usuario.** Completado y verificado (`flutter analyze`, `flutter
test` 635/635, `flutter run -d windows`, `git status`). Ver la tabla de
features en la sección 4 para el detalle. Consolidado con commit
exclusivo (ver sección de cierre de sesión más abajo para el hash) tras
`dart format .` + re-verificación de `flutter analyze`/`flutter test`.

## 10. Siguiente prompt sugerido

**Prompt 31 — Request Service (flujo de solicitud, visual)** *(nota
histórica: ya completado — ver arriba; sección conservada como
registro de la planificación original)*, siguiendo exactamente el
mismo patrón que `service_detail`/`provider_profile`:
`presentation/` (sin `Scaffold` propio) + `models/` (composición
tipada) + `repositories/` (contrato + `Mock*Repository`, solo
entidades reales de dominio — `Quote`/`Order` probablemente) + `mock/`
+ `README.md`. Cambio mínimo autorizado esperado: que el botón
"Solicitar servicio" (hoy no-op en `service_detail` y
`provider_profile`) navegue a esta nueva pantalla. Seguir sin backend,
sin gestión de estado, sin persistencia. Después de eso, el Sprint de
Branding (Prompt 33.1) es el próximo hito grande ya acordado con el
usuario.

### Actualización — Siguiente prompt real

**Prompt 43 — Availability (visual completo)**, confirmado por el
usuario como el siguiente prompt tras este Sprint de Consolidación.
Debería seguir exactamente el mismo patrón arquitectónico usado desde
`service_detail` hasta `provider_services`: `Availability` (módulo de
dominio ya existente, 100% completo — ver sección 3) compuesto junto a
`Provider`/`Profile` reales, con los campos simulados que el próximo
prompt indique explícitamente documentados en el modelo y el README. El
Sprint de Branding sigue como hito grande pendiente, todavía sin número
de prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 43)

**Prompt 44 — Verification (visual completo)**. **Aprobado por el
usuario y consolidado.** Compone `Identity`/`Profile` reales del
dominio (módulos ya completos — ver sección 3) más campos simulados de
estado de verificación documentados en su propio README. Cambio mínimo
aplicado: un tercer botón "Verificación" en `provider_profile` (junto a
"Solicitar servicio"/"Chat") que navega con `Navigator.push` a
`VerificationPage`. Verificado con `flutter analyze` (`No issues
found!`), `flutter test` (656/656) y `dart format .` (0 archivos
modificados). El Sprint de Branding sigue como hito grande pendiente,
todavía sin número de prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 44)

**Prompt 45 — Trust**, siguiente prompt acordado con el usuario,
siguiendo el mismo patrón arquitectónico usado desde `service_detail`
hasta `verification`: módulo de dominio `Trust` (ya completo — ver
sección 3) compuesto junto a las entidades reales que el prompt
indique, con cualquier campo simulado documentado explícitamente en el
modelo y el README. El Sprint de Branding sigue como hito grande
pendiente, todavía sin número de prompt asignado.

## 11. Sugerencia de versionado (aún no aplicada)

El usuario propuso etiquetar hitos con tags de git:
`v0.1.0` (arquitectura completa) → `v0.2.0` (Application + Presentation +
Core UI) → `v0.3.0` (Navegación + Splash) → `v0.4.0` (Onboarding) →
`v0.5.0` (Login) → `v0.6.0` (Registro) → `v0.7.0` (Home). Aún no se ha
creado ningún tag — es una recomendación pendiente de aplicar.

## Repositorio oficial

Desde este momento, el **único repositorio oficial** del proyecto es:

```
C:\dev\AppServicios_nuevo
```

Contexto y reglas:

- Existe un **scaffold antiguo** en `C:\dev\AppServicios` que **NO
  pertenece a este proyecto**. Tiene 0 commits de git, estructura de
  carpetas distinta (`backend/` y `mobile/` en la raíz en vez de `apps/`),
  no tiene `PROJECT_STATUS.md`, ni Core UI, ni Navigation, ni Onboarding.
  No debe usarse como base de nada — se mantiene intacto únicamente por
  precaución, ya que su contenido nunca fue commiteado y podría perderse
  si se elimina sin revisión previa.
- Existe una **copia idéntica** del repositorio oficial bajo
  `C:\Users\ANYELO\Documents\Grupo empresarial 180°\PROYECTOS\ServiYA\APP`,
  usada **únicamente como respaldo temporal** mientras se confirma la
  migración definitiva a `C:\dev\AppServicios_nuevo`. No es una fuente de
  verdad adicional.
- Todo el desarrollo futuro debe realizarse **exclusivamente** sobre
  `C:\dev\AppServicios_nuevo`.
- **No deben mezclarse archivos** entre los tres proyectos anteriores
  (scaffold antiguo, respaldo bajo `Documents`, repositorio oficial).
- **No deben abrirse dos de estos proyectos simultáneamente** en Android
  Studio o VS Code (evita bloqueos de archivos, indexado cruzado y
  confusión sobre cuál carpeta se está editando).

## Estado del entorno

- `flutter analyze` funciona correctamente sobre `C:\dev\AppServicios_nuevo`
  (`No issues found!`).
- `flutter test` funciona correctamente (**333/333 tests pasando** al
  cierre del Prompt 30 — ver sección 4 para el detalle por feature).
- El problema del carácter `°` (que afectaba `flutter analyze` y
  `flutter build windows` en la ruta anterior bajo
  `Grupo empresarial 180°`) **ya no existe** en la ruta oficial.
- Ya **no es necesario** usar `dart analyze` como workaround de
  `flutter analyze` — el comando estándar de Flutter funciona
  directamente.

### Actualización — Estado del entorno tras el Prompt 42 y el Sprint de Consolidación

- `flutter analyze` sigue en `No issues found!` con los 12 features
  nuevos (31–42) incluidos.
- `flutter test` pasa **613/613 tests** (333 previos + los agregados
  por cada feature de los Prompts 31–42, incluyendo `settings`).
- `flutter run -d windows` compila y corre sin errores (dispositivo
  físico Realme RMX3938 seguía sin conectarse durante esta racha de
  prompts; sigue pendiente como buena práctica, no bloqueante).

### Actualización — Estado del entorno tras el Prompt 43

- `flutter analyze` sigue en `No issues found!` con el feature
  `availability` incluido.
- `flutter test` pasa **635/635 tests** (613 previos + 22 agregados
  por `availability`).
- `dart format .` se ejecutó como parte de la consolidación de este
  prompt; si reformateó algún archivo, se re-verificó
  `flutter analyze`/`flutter test` después.
- `flutter run -d windows` compila y corre sin errores (dispositivo
  físico seguía sin conectarse; sigue pendiente, no bloqueante).

## Estado del repositorio al cierre de esta sesión (previo al Prompt 31)

Este handoff se generó justo antes de cerrar la conversación por límite
de contexto. Para que la siguiente sesión (con o sin memoria de esta
conversación) pueda retomar sin ambigüedad:

- **Todo el trabajo de los Prompts 19–30 fue aprobado explícitamente
  por el usuario**, prompt por prompt, verificando en cada uno
  `flutter analyze` + `flutter test` + `flutter run`.
- Inmediatamente después de actualizar este archivo, se ejecutó un
  **commit de continuidad** con todo el código de `apps/mobile/`
  (features 19–30 + el fix de `AppButton` + los READMEs), **sin
  incluir `Logo oficial grupo.svg`** (branding sigue congelado, ver
  sección 7).
- Si al abrir una nueva sesión `git status` muestra ese commit como el
  más reciente y el working tree está limpio (salvo, quizás, el
  `Logo oficial grupo.svg` sin trackear), el estado es exactamente el
  que se describe en este documento — se puede continuar directamente
  con el **Prompt 31** sin re-verificar nada de los Prompts 19–30.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 31** — confirmar con el usuario antes
  de continuar, seguiendo la misma disciplina de "leer
  PROJECT_STATUS.md → confirmar repo oficial → `git status` → confirmar
  qué cambios corresponden a qué prompt" usada en cada prompt anterior.

## Estado del repositorio al cierre de esta sesión (Sprint de Consolidación, previo al Prompt 43)

Este es el handoff vigente — más reciente que el bloque anterior (que
se conserva como registro histórico, sin eliminar).

- **Todo el trabajo de los Prompts 31–42 fue aprobado explícitamente
  por el usuario**, prompt por prompt, verificando en cada uno
  `flutter analyze` + `flutter test` + `flutter run -d windows` + `git
  status`. El Prompt 39 (`settings`) fue insertado fuera de la
  numeración original del usuario (ver sección 4) porque el Prompt 40
  asumía su existencia — confirmado explícitamente con el usuario antes
  de proceder.
- Inmediatamente después de actualizar este archivo (Sprint de
  Consolidación), se ejecutó un **único commit de consolidación** con
  todo el código nuevo de `apps/mobile/` (los 12 features 31–42 + los
  cambios mínimos de navegación en `app_shell`/`provider_profile`),
  **sin incluir `Logo oficial grupo.svg`** (branding sigue congelado,
  ver sección 7).
- Si al abrir una nueva sesión `git status` muestra ese commit como el
  más reciente y el working tree está limpio (salvo, quizás, el
  `Logo oficial grupo.svg` sin trackear), el estado es exactamente el
  que se describe en este documento — se puede continuar directamente
  con el **Prompt 43 — Availability** sin re-verificar nada de los
  Prompts 19–42.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 43** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 43 consolidado, previo al Prompt 44)

Este es el handoff vigente — más reciente que los dos bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 43 (`availability`) fue aprobado explícitamente por el
  usuario**, verificado con `flutter analyze` + `flutter test`
  (635/635) + `flutter run -d windows` + `git status`.
- Como parte de la consolidación de este prompt se ejecutó
  `dart format .` sobre todo `apps/mobile/` (solo cambios de estilo en
  100 archivos existentes, sin alterar comportamiento), re-verificado
  con `flutter analyze` (`No issues found!`) y `flutter test`
  (635/635) después de formatear.
- Se creó un **único commit exclusivo del Prompt 43** con el mensaje
  `Prompt 43 - Availability feature completed` (ver `git log -1` para
  el hash exacto — no se fija aquí el hash literal porque una edición
  posterior de este mismo archivo para registrarlo lo cambiaría de
  nuevo, un problema de auto-referencia inherente a Git). Incluye el
  feature `availability` completo, el cambio mínimo de navegación en
  `provider_dashboard`, y el resultado de `dart format .` sobre el
  resto del proyecto — **sin incluir `Logo oficial grupo.svg`**
  (branding sigue congelado, ver sección 7).
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- Si al abrir una nueva sesión `git status` muestra ese commit como el
  más reciente y el working tree está limpio (salvo el
  `Logo oficial grupo.svg` sin trackear), el estado es exactamente el
  que se describe en este documento — se puede continuar directamente
  con el **Prompt 44 — Verification** (siguiente prompt acordado, ver
  sección 10) sin re-verificar nada de los Prompts 19–43.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 44** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 44 consolidado, previo al Prompt 45)

Este es el handoff vigente — más reciente que los tres bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 44 (`verification`) fue aprobado explícitamente por el
  usuario**, verificado con `flutter analyze` (`No issues found!`),
  `flutter test` (656/656), `dart format .` (0 archivos modificados,
  ya estaba formateado) y `git status`.
- El feature llegó ya construido y verificado en una sesión previa
  (código + tests de `verification`, cambio mínimo de navegación en
  `provider_profile/presentation/widgets/provider_actions.dart` y su
  README) — esta sesión ejecutó el Sprint de Consolidación
  correspondiente: actualización de este documento, `dart format .`,
  re-verificación de `flutter analyze`/`flutter test`, y commit único.
- Se creó un **único commit exclusivo del Prompt 44** con el mensaje
  `Prompt 44 - Verification feature completed` (ver `git log -1` para
  el hash exacto — no se fija aquí el hash literal por la misma razón
  de auto-referencia explicada en la sección del Prompt 43). Incluye el
  feature `verification` completo, el cambio mínimo de navegación en
  `provider_profile`, y la actualización de este archivo —
  **sin incluir `Logo oficial grupo.svg`** (branding sigue congelado,
  ver sección 7).
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- Si al abrir una nueva sesión `git status` muestra ese commit como el
  más reciente y el working tree está limpio (salvo el
  `Logo oficial grupo.svg` sin trackear), el estado es exactamente el
  que se describe en este documento — se puede continuar directamente
  con el **Prompt 45 — Trust** (siguiente prompt acordado, ver
  sección 10) sin re-verificar nada de los Prompts 19–44.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 45** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.
