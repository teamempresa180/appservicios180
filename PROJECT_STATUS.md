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
| 45 | `trust` | Confianza y reputación: `Identity`/`Trust` reales (una cuenta fija), puntaje/nivel/estado/última actualización reales (passthrough de `Trust.score`/`level`/`status`/`updatedAt`, sin restricción de entidades como en `verification`), `factors` (desglose de por qué el puntaje es el que es) totalmente simulado porque el propio dominio `Trust` está documentado como "sin lógica de cálculo". | `provider_profile` (cuarto botón "Confianza", agregado junto a "Solicitar servicio"/"Chat"/"Verificación"). |
| 46 | `schedule` | Agenda concreta del proveedor: `Provider`/`List<Schedule>` reales (6 bloques cubriendo cada `ScheduleStatus`/`ScheduleType`), conteos por estado + horas abiertas + día/hora/tipo/estado de cada bloque, todo **derivado** de datos reales — **sin ningún campo simulado**, a diferencia de todos los features anteriores desde `service_detail`. | `provider_dashboard` (quinto botón "Agenda" en `QuickActions`, junto a "Ver servicios"/"Disponibilidad"/"Estadísticas"/"Configuración"). |
| 47 | `contact_management` | Gestión de canales de contacto: `Profile`/`List<Contact>` reales (5 contactos cubriendo cada `ContactType`/`ContactStatus`), conteos por estado + tipo/valor/estado de cada contacto, todo **derivado** de datos reales — **sin ningún campo simulado**, mismo criterio que `schedule`. `Contact` ya existía como dato de apoyo en `address_management` pero nunca había tenido pantalla propia. | `settings` (nueva opción "Contactos" en el menú, junto a "Direcciones"). |
| 48 | `security` | Métodos de autenticación de la cuenta: `Identity`/`List<Authentication>` reales (5 métodos cubriendo cada `AuthMethodType`/`AuthenticationStatus`), conteos por estado + tipo/estado de cada método, todo **derivado** de datos reales — **sin ningún campo simulado**, mismo criterio que `schedule`/`contact_management`. `Authentication` nunca se había usado en ningún feature; `Credentials` (material secreto) queda explícitamente fuera de alcance. | `settings` (nueva opción "Seguridad" en el menú, junto a "Contactos"). |
| 49 | `security` *(extensión)* | Se agregó `List<Credential>` real (4 credenciales cubriendo cada `CredentialType`/`CredentialStatus`) al mismo feature `security` — **no se creó un feature nuevo**: `Credential` es conceptualmente casi idéntico a `Authentication` y el propio README de `security` ya había anticipado esta extensión desde el Prompt 48. `SecurityDisplay`/`SecurityRepository`/`SecurityPage` ganaron el campo/método/sección nuevos; conteos por estado de credenciales también derivados, sin campos simulados. | Sin cambio de navegación — `security` ya era alcanzable desde `settings` ("Seguridad"). |
| 50 | `security` *(extensión)* | Se agregó `List<Audit>` real (5 entradas cubriendo la mayoría de `AuditActionType`) al mismo feature `security` — **no se creó un feature nuevo**: `Audit` solo referencia `IdentityId` (mismo patrón que `Credential`) y encaja como "Actividad reciente de la cuenta". De los tres módulos sin uso (`Audit`, `Attachment`, `Message`), `Message` ya estaba resuelto por `chat`; `Attachment` quedó documentado como oportunidad futura para `chat`, no elegida esta vez. `SecurityDisplay`/`SecurityRepository`/`SecurityPage` ganaron el campo/método/sección nuevos, sin campos simulados (`sortedAuditLog` solo ordena, `Audit.description` es texto real). | Sin cambio de navegación — `security` ya era alcanzable desde `settings` ("Seguridad"). |
| 51 | `chat` *(extensión)* | Se agregó `List<Attachment>` real (5 adjuntos cubriendo cada `AttachmentType`/`AttachmentStatus`, algunos mensajes con más de uno) al mismo feature `chat` — **no se creó un feature nuevo**: `Attachment` solo referencia `MessageId` y era el último de los 23 módulos de dominio sin ninguna representación visual. `ChatDisplay`/`ChatRepository`/`MessageBubble` ganaron el campo/método/widget nuevos (`attachments`, `attachmentsFor`, `AttachmentPreview`), sin campos simulados. **Con este prompt, los 23 módulos de dominio quedan con representación visual completa.** | Sin cambio de navegación — `chat` ya era alcanzable desde `payments` ("Ver recibo"). |

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

### Verificación Flutter (actualizada — Prompt 45 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 674/674 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 46 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 694/694 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 47 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 715/715 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 48 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 736/736 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 49 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 740/740 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 50 aprobado)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 744/744 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Prompt 51 aprobado, cierre del Sprint 1)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 748/748 tests
flutter run -d windows    ✅ compila y corre sin errores
```

### Verificación Flutter (actualizada — Sprint 2 Etapa 1 aprobada)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 748/748 tests (sin cambios — solo tokens nuevos, nada wireado)
flutter run -d windows    ✅ compila y corre sin errores, visualmente idéntico
```

### Verificación Flutter (actualizada — Sprint 2 Etapa 2 aprobada, Prompt 52)
```
flutter analyze          ✅ No issues found!
flutter test              ✅ 748/748 tests (sin cambios — ningún feature tocado, solo core/ui)
flutter run -d windows    ✅ compila y corre — identidad oficial ya aplicada automáticamente
```

### Verificación Flutter (actualizada — Sprint 2 Etapa 3 aprobada, Prompt 53)
```
dart format .             ✅ 627 archivos, 0 cambios (ya formateado)
flutter analyze           ✅ No issues found!
flutter test               ✅ 748/748 tests (sin cambios — refactor puramente visual, mismo comportamiento)
```

### Verificación Flutter (actualizada — Sprint 2 Etapa 4 aprobada, Prompt 54)
```
dart format .             ✅ 633 archivos, 0 cambios (ya formateado)
flutter analyze           ✅ No issues found!
flutter test               ✅ 748/748 tests (sin cambios — refactor estructural, mismo comportamiento)
flutter build windows     ✅ Build exitoso (mobile.exe)
```

### Verificación Flutter (actualizada — Sprint 2 Etapa 5 aprobada, Prompt 55)
```
dart format .             ✅ 633 archivos, 0 cambios (ya formateado)
flutter analyze           ✅ No issues found!
flutter test               ✅ 748/748 tests (sin cambios — solo UX/microinteracciones)
flutter build windows     ✅ Build exitoso (mobile.exe)
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

**Actualización (Prompt 45)**: `Trust` ya existe como feature 100%
visual/mock (`trust`), abierto desde `provider_profile` (cuarto botón
"Confianza"). A diferencia de `Verification`, este prompt no restringió
las entidades permitidas, así que el feature usa directamente el
módulo de dominio real `Trust` (`score`/`level`/`status`/`updatedAt`
reales) — solo `factors` (el desglose de por qué el puntaje es el que
es) queda simulado, porque la propia entidad `Trust` está documentada
en el dominio como "sin lógica de cálculo". Ver el README de
`features/trust/` para el detalle completo.

**Actualización (Prompt 46)**: `Schedule` ya existe como feature 100%
visual/mock (`schedule`), abierto desde `provider_dashboard` (quinto
botón "Agenda" en `QuickActions`). Este feature no tiene **ningún**
campo simulado — a diferencia de todos los anteriores desde
`service_detail` — porque el módulo de dominio real `Schedule` ya
modela exactamente lo que la pantalla necesita (fecha/hora de
inicio/fin, tipo, estado de cada bloque); todo lo mostrado (conteos por
estado, horas abiertas) es una agregación derivada sobre esos datos
100% reales. Ver el README de `features/schedule/` para el detalle
completo, incluyendo la diferencia con `Availability`.

**Actualización (Prompt 47)**: `Contact` ya existe como feature 100%
visual/mock propio (`contact_management`), abierto desde `settings`
(nueva opción "Contactos"). El módulo de dominio `Contact` ya existía
desde el inicio del proyecto pero solo se usaba como dato de apoyo
dentro de `address_management` (Prompt 40); este prompt le da su
propia pantalla de gestión, sin ningún campo simulado — mismo criterio
que `schedule`. Ver el README de `features/contact_management/` para
el detalle completo.

**Actualización (Prompt 48)**: `Authentication` ya existe como feature
100% visual/mock propio (`security`), abierto desde `settings` (nueva
opción "Seguridad"). Ningún feature había usado `Authentication`
todavía. Sin ningún campo simulado — mismo criterio que
`schedule`/`contact_management`. `Credentials` (material secreto)
queda explícitamente documentado como fuera de alcance de este prompt,
reservado para una futura extensión de este mismo feature (ver la
sección "Cómo conectar posteriormente" del README de
`features/security/`).

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

### Actualización — Prompt 53 completado (Sprint 2, Etapa 3)

**Prompt 53 — Adopción global del Design System (visual, sin
funcionalidades nuevas)**. **Aprobado por el usuario y consolidado.**
Migró los 58 archivos afectados (ver detalle en la sección 4, Sprint 2
Etapa 3) para que todos los features usen `AppStatTile`/`AppBadge`/
`AppAvatar` en vez de widgets privados duplicados, sin alterar
comportamiento visual, navegación ni lógica de negocio. Verificado con
`dart format .` (0 cambios), `flutter analyze` (`No issues found!`) y
`flutter test` (748/748, sin cambios). El siguiente hito es el Prompt
54 (Sprint 2, Etapa 4 — refactor global de layouts reutilizables:
`AppPageHeader`, `AppSectionHeader`, `AppSection`, `AppInfoRow`,
`AppActionRow`, `AppPagePadding`, `AppPageBody`), ya en curso al cierre
de este documento.

### Actualización — Prompt 54 completado (Sprint 2, Etapa 4)

**Prompt 54 — Refactor global de layouts reutilizables (visual/
estructural, sin funcionalidades nuevas)**. **Aprobado por el usuario y
consolidado.** Creó 6 layouts nuevos en `core/ui/widgets/`
(`AppPageBody`, `AppSection`, `AppInfoRow`, `AppActionRow`,
`AppStatGrid`, `AppIconRow`) y migró ~50 archivos para usarlos en vez
de reconstruir la misma estructura por feature — ver detalle en la
sección 4, Sprint 2 Etapa 4. Verificado con `dart format .` (0
cambios), `flutter analyze` (`No issues found!`), `flutter test`
(748/748) y `flutter build windows`. El siguiente hito es el Prompt 55
(Sprint 2, Etapa 5 — UX global, microinteracciones y experiencia de
usuario: FadeIn/ScaleIn/SlideIn donde falte, feedback consistente,
mejoras de escritorio), ya en curso al cierre de este documento.

### Actualización — Prompt 55 completado (Sprint 2, Etapa 5)

**Prompt 55 — UX global, microinteracciones y experiencia de usuario**.
**Aprobado por el usuario y consolidado.** Ver detalle completo en la
sección 4, Sprint 2 Etapa 5. Verificado con `dart format .` (0
cambios), `flutter analyze` (`No issues found!`), `flutter test`
(748/748) y `flutter build windows`. El usuario decidió que, en vez de
seguir con etapas pequeñas, el siguiente hito sea un **Prompt 56 —
Sprint 2, Etapa 6 — Preparación para Backend (Frontend
Infrastructure)**, más grande: auditoría y estandarización de
repositorios, capa `datasources/`/`mappers/` (solo interfaces, sin
implementación real), DTOs preparados, reducción de acoplamiento,
auditorías de performance/accesibilidad/i18n — todo sin agregar
backend, HTTP, Firebase ni gestión de estado, y sin romper ningún
comportamiento existente. Ya en curso al cierre de este documento.

### Actualización — Prompt 58 completado (Sprint 3, Etapa 1)

**Prompt 58 — Shared Kernel + Infraestructura Backend**. **Aprobado por
el usuario y consolidado.** Primer trabajo real sobre `apps/backend`
desde el cierre de Sprint 1. Auditó los 22 módulos de dominio antes de
tocar nada: confirmó que `Entity`/`ValueObject`/`DomainException`/
`generateId()` ya existían en `modules/core/` (Shared Kernel ya
funcionando, usado por los 22 módulos) y que **ningún módulo tiene
consumidor real** para `Money`/`Email`/`PhoneNumber`/`DocumentNumber`/
`Percentage`/`Rating`/`AggregateRoot`/`DomainEvent`/`Result`/`Either` —
por lo tanto **no se crearon** (decisión documentada explícitamente en
`modules/core/README.md`, siguiendo la instrucción explícita del
usuario de no inventar clases sin consumidor real). Sí se agregó la
jerarquía de excepciones (`NotFoundException`/`ValidationException`/
`BusinessRuleException` extendiendo `DomainException`, con tests) y el
bootstrap completo de NestJS: `ConfigModule`/`ConfigService` (propio,
sin dependencias nuevas), `LoggerModule`/`AppLogger`,
`DomainExceptionFilter`+`AllExceptionsFilter` (manejo global de
errores), `LoggingInterceptor`, todo registrado en `main.ts`. Sin
JWT, HTTP, Controllers, Services, Repositories reales, base de datos,
Prisma, TypeORM ni Firebase — sin tocar Flutter. Verificado con `npm
run build`, `npm run lint`, `jest` (132/132, antes 113/113 —
+19 tests), `jest e2e` (1/1), `dart format .`, `flutter analyze`,
`flutter test` (748/748) y `flutter build windows`.

### Actualización — Prompt 57 completado (cierre definitivo de Sprint 2, preparación de Sprint 3)

**Prompt 57 — Cierre definitivo del Sprint 2 y preparación para Sprint
3**. **Aprobado por el usuario y consolidado.** Auditó los 17 features
sin `mapper`/`dto` (15/17 migran con el patrón exacto de los 6 de
referencia; 2 excepciones documentadas: `marketplace` necesita 3
mappers, `search` necesita 2 métodos nuevos en su repositorio),
auditó la arquitectura completa buscando bloqueos para Sprint 3 (no se
encontró ninguno), y creó `SPRINT3_PREPARATION.md` (estado real,
qué sigue siendo mock, orden de migración, riesgos, roadmap completo
de Sprint 3 por Bounded Context). Trabajo puramente de análisis y
documentación — ningún archivo de Flutter se modificó más allá de
`PROJECT_STATUS.md`. Verificado con `dart format .` (0 cambios),
`flutter analyze` (`No issues found!`), `flutter test` (748/748) y
`flutter build windows`. El siguiente hito es el **Prompt 58 — Sprint
3, Etapa 1 — Shared Kernel + Infraestructura Backend**: primer trabajo
real sobre `apps/backend` (NestJS) desde el cierre de Sprint 1 — sin
tocar Flutter, sin reemplazar ningún mock todavía.

### Actualización — Prompt 56 completado (Sprint 2, Etapa 6)

**Prompt 56 — Preparación para Backend (Frontend Infrastructure)**.
**Aprobado por el usuario y consolidado.** Decisión explícita del
usuario de agrupar varias fases pequeñas en una etapa más grande tras
cerrar Sprint 1 + Sprint 2 Etapas 1–5. Ver detalle completo en la
sección 4 y en [`apps/mobile/ARCHITECTURE.md`](apps/mobile/ARCHITECTURE.md).
Verificado con `dart format .` (0 cambios), `flutter analyze` (`No
issues found!`), `flutter test` (748/748) y `flutter build windows`.
Con este prompt se cierra oficialmente el **Sprint 2 (Branding & UX +
preparación de infraestructura)**. El siguiente hito es el **Prompt
57 — Cierre definitivo del Sprint 2 y preparación para Sprint 3**:
consolidación, auditoría de los 17 features sin mapper/DTO, auditoría
arquitectónica previa al backend, y creación de
`SPRINT3_PREPARATION.md` (sin commitear ese documento todavía).

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

**Prompt 45 — Trust (visual completo)**. **Aprobado por el usuario y
consolidado.** Compone `Identity`/`Trust` reales del dominio (módulos
ya completos — ver sección 3), sin restricción de entidades — por eso
usa directamente `Trust.score`/`level`/`status`/`updatedAt` reales, con
solo `factors` simulado (ver nota en sección 4). Cambio mínimo
aplicado: un cuarto botón "Confianza" en `provider_profile` (junto a
"Solicitar servicio"/"Chat"/"Verificación") que navega con
`Navigator.push` a `TrustPage`. Verificado con `flutter analyze` (`No
issues found!`), `flutter test` (674/674) y `dart format .`. El Sprint
de Branding sigue como hito grande pendiente, todavía sin número de
prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 45)

**Prompt 46 — Schedule (visual completo)**. **Aprobado por el usuario y
consolidado.** Compone `Provider`/`List<Schedule>` reales del dominio
(módulos ya completos — ver sección 3), mostrando la agenda concreta de
bloques de tiempo del proveedor (distinta de `Availability`, que
declara disponibilidad semanal amplia — ver el README propio del
dominio `schedule/` para la diferencia). Sin ningún campo simulado —
todo derivado de los 6 bloques reales del mock. Cambio mínimo aplicado:
un quinto botón "Agenda" en `provider_dashboard` (`QuickActions`) que
navega con `Navigator.push` a `SchedulePage`. Verificado con `flutter
analyze` (`No issues found!`), `flutter test` (694/694) y `dart format
.`. El Sprint de Branding sigue como hito grande pendiente, todavía sin
número de prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 46)

**Prompt 47 — Contact Management (visual completo)**. **Aprobado por el
usuario y consolidado.** El módulo de dominio `Contact` (ya completo —
ver sección 3) existía desde el inicio del proyecto pero solo se había
usado de forma parcial: `address_management` (Prompt 40) reutiliza un
único `Contact` fijo como dato de apoyo de cada dirección, sin darle
nunca su propia pantalla de gestión. Este prompt le dio a `Contact` el
mismo tratamiento de primera clase que ya tienen
`Address`/`Availability`/`Schedule`: lista de canales de contacto
(correo/teléfono/otro) de una `Identity`, mostrando
`Contact.type`/`value`/`status` reales sin ningún campo simulado.
Cambio mínimo aplicado: nueva opción "Contactos" en el menú de
`settings`, wireada igual que "Direcciones". Verificado con `flutter
analyze` (`No issues found!`), `flutter test` (715/715) y `dart format
.`. El Sprint de Branding sigue como hito grande pendiente, todavía sin
número de prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 47)

**Prompt 48 — Security (métodos de autenticación)**. **Aprobado por el
usuario y consolidado.** El módulo de dominio `Authentication` (ya
completo — ver sección 3) modela la asociación entre una `Identity` y
un método que puede usar para autenticarse
(contraseña/biometría/código de un solo uso/tercero/otro) más su
estado (activo/inactivo/bloqueado/revocado) — nunca usado en ningún
feature hasta ahora. Sin ningún campo simulado. Cambio mínimo aplicado:
nueva opción "Seguridad" en el menú de `settings`, wireada igual que
"Direcciones"/"Contactos". Verificado con `flutter analyze` (`No
issues found!`), `flutter test` (736/736) y `dart format .`. El Sprint
de Branding sigue como hito grande pendiente, todavía sin número de
prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 48)

**Prompt 49 — Credentials, como extensión de `security` (no un feature
nuevo)**. **Aprobado por el usuario y consolidado.** Revisión
arquitectónica previa a implementar: el módulo de dominio `Credentials`
(ya completo — ver sección 3) modela que existe material de credencial
de un tipo dado (`password`/`recoveryCode`/`securityKey`/`other`) para
una `Identity`, con su propio estado
(`active`/`expired`/`revoked`) — nunca el secreto en sí. Es
conceptualmente casi idéntico en forma a `Authentication`
(`identityId` + enum de tipo + enum de estado + timestamps) y el
propio README de `security` (Prompt 48) ya documentó esta ruta:
*"Cuando se decida modelar el material secreto en sí, `Credentials` se
sumaría como una entidad adicional del repositorio, sin romper el
contrato actual de `SecurityRepository`"*. Crear un feature
`credentials` aparte hubiera producido una pantalla casi idéntica a
`security`, duplicando UI y navegación sin necesidad — se decidió
**extender `security`** (nuevo campo `credentials` en
`SecurityDisplay`, nuevo método en `SecurityRepository`, nueva sección
visual en `SecurityPage`) en vez de crear un feature nuevo. No hizo
falta ningún cambio de navegación: `security` ya es alcanzable desde
`settings` ("Seguridad"). Verificado con `flutter analyze` (`No issues
found!`), `flutter test` (740/740) y `dart format .`. El Sprint de
Branding sigue como hito grande pendiente, todavía sin número de
prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 49)

**Prompt 50 — Audit, como extensión de `security` (no un feature
nuevo)**. **Aprobado por el usuario y consolidado.** Revisión
arquitectónica previa a implementar: de los tres módulos de dominio que
ningún feature usaba todavía (`Audit`, `Attachment`, `Message`),
`Message` ya estaba resuelto — `chat` (Prompt 35) lo usa como entidad
real desde su construcción original, no quedaba trabajo ahí. Entre
`Audit` y `Attachment`, se eligió `Audit` porque encaja naturalmente
como "Actividad reciente de la cuenta" junto a
`Authentication`/`Credentials`, ya presentes en `security` — mismo
patrón de extensión ya validado en el Prompt 49, evitando crear un
feature nuevo para una entidad que únicamente referencia `IdentityId`.
`Attachment` (archivo adjunto a un `Message`) quedó documentado como
oportunidad futura para `chat`, no descartado, solo no elegido en ese
momento. Verificado con `flutter analyze` (`No issues found!`),
`flutter test` (744/744) y `dart format .`. El Sprint de Branding sigue
como hito grande pendiente, todavía sin número de prompt asignado.

### Actualización — Siguiente prompt real (tras el Prompt 50)

**Prompt 51 — Attachment, como extensión de `chat` (no un feature
nuevo)**. **Aprobado por el usuario y consolidado — cierre oficial del
Sprint 1.** Resultado de una auditoría completa del dominio (ver la
sección "Fase 2" del handoff de esa sesión para la tabla A/B/C/D
completa). Con esta extensión, `Attachment` era el único módulo de
dominio de los 23 sin ninguna representación visual en ningún feature
— se integró en `chat` (bounded context Communication, mismo al que
pertenecen `Chat`/`Message`), no como feature nuevo, siguiendo
exactamente el mismo criterio ya aplicado en `security` (Prompts
49–50). Verificado con `flutter analyze` (`No issues found!`),
`flutter test` (748/748) y `dart format .`. **Con este prompt, los 23
módulos de dominio quedan con representación visual completa** — no
queda ningún módulo en categoría C.

## Sprint 1 — Cierre oficial (Prompts 19–51)

El **Sprint 1 (Frontend Flutter, visual/mock, sin backend)** queda
oficialmente cerrado con el Prompt 51. Resumen:

- **43 prompts de features/extensiones** (19–51), cada uno aprobado
  explícitamente por el usuario y consolidado con su propio commit
  exclusivo, siguiendo la disciplina "1 prompt = 1 commit" desde el
  Prompt 31.
- **Los 23 módulos de dominio** (Domain layer, 100% completo desde
  antes de este sprint) **tienen representación visual** en al menos un
  feature — 21 como feature dedicado, 2 (`Credentials`, `Audit`) y 1
  más (`Attachment`) como extensiones deliberadas de features ya
  existentes (`security`×2, `chat`×1) en vez de features nuevos,
  siguiendo la disciplina arquitectónica introducida en los Prompts
  49–51 ("extender en vez de duplicar pantallas").
- **748 tests pasando**, `flutter analyze` limpio, `flutter run -d
  windows` funcional — verificado en cada prompt.
- **Sin backend, sin HTTP, sin Firebase, sin WebSockets, sin gestión de
  estado** (Provider/Riverpod/Bloc/Cubit/ViewModel), sin persistencia,
  sin autenticación real — exactamente como se planeó desde el inicio.
- **Sin identidad visual oficial todavía** — paleta 100% neutra (ver
  sección 4), `Logo oficial grupo.svg` presente en la raíz del
  repositorio pero **intencionalmente sin trackear** desde el inicio
  del proyecto, reservado para el Sprint de Branding.

## Sprint 2 — Branding & UX (en curso)

### Etapa 1 — Fundación del Design System oficial (aprobada y consolidada)

Construyó la identidad visual oficial completa (nombre "Servicios
180°", paleta con escalas 50–900 derivadas exactamente de
`Logo oficial grupo.svg`, tipografía, especificación de animaciones,
iconografía, estilos de botones/campos/cards/diálogos/bottom sheets/
chips), documentada íntegramente en `apps/mobile/lib/core/ui/BRANDING.md`.
Se agregaron los tokens (`AppBrandPalette`, `AppTypography`,
`AppCurves`, `AppImageSize`, `AppRadius.radiusPill`) y se resolvió la
inconsistencia de ícono "más opciones" (`AppIcons.more` → `more_horiz`)
y se nombraron las curvas de animación ya usadas por
`FadeIn`/`ScaleIn`/`SlideIn` (mismo comportamiento, solo tokens). **No
se conectó nada al tema activo todavía** — decisión deliberada,
documentada en el propio `BRANDING.md`: la aplicación consistente del
branding a todas las pantallas es el objetivo de la Etapa 2. Verificado
con `flutter analyze` (`No issues found!`) y `flutter test` (748/748,
sin cambios, ya que ningún comportamiento visual se tocó).

### Etapa 2 — Aplicación del Branding al Core UI (Prompt 52, aprobada y consolidada)

Conectó `AppBrandPalette`/`AppTypography` al `AppTheme.light` activo
(`ColorScheme`/`textTheme` construidos exclusivamente desde la paleta
oficial; `AppColors` provisional eliminado por completo — no tenía
ningún uso fuera de `app_theme.dart`). Extendió `AppButton` con 4
variantes (`filled`/`tonal`/`outlined`/`text`, default `filled` —
retrocompatible, cero cambios en los ~40 call sites existentes) y creó
8 componentes nuevos: `AppLoadingIndicator`, `AppStatTile`, `AppChip`,
`AppDialog`, `AppBottomSheet`, `AppSnackBar`, `AppAvatar`, `AppBadge`.
`AppTextField`/`AppCard`/`AppDivider` no requirieron ningún cambio de
código — ya eran 100% theme-driven, así que heredaron la marca
automáticamente solo por el cambio en `app_theme.dart`. **Ningún
feature fue tocado.** Verificado con `flutter analyze` (`No issues
found!`) y `flutter test` (748/748, sin cambios, ya que ningún
comportamiento de negocio se tocó — solo el tema global).

### Etapa 6 — Preparación para Backend / Frontend Infrastructure (Prompt 56, aprobada y consolidada)

Sin agregar backend, HTTP, Firebase ni gestión de estado — solo
infraestructura frontend lista para Sprint 3. Ver
[`apps/mobile/ARCHITECTURE.md`](apps/mobile/ARCHITECTURE.md) para el
detalle completo del patrón de capas. Resumen:

- **Auditoría de repositorios** (23 features de datos, 7 features de
  navegación/auth sin datos): confirmó naming 100% consistente
  (`XRepository`/`MockXRepository`), pero encontró que 18/23 páginas
  importan `mock/` directamente además de pasar por el repositorio, 2
  páginas (`categories`, `marketplace`) componían datos inline sin
  `_buildData()`, y 5 `Display` usan sufijos distintos
  (`XData`/`SearchResult` en vez de `XDisplay`).
- **Estandarización**: `categories_page.dart`/`marketplace_page.dart`
  ganaron métodos `_build*()` con el mismo criterio que las otras 21
  páginas.
- **`datasources/`**: `<X>LocalDataSource`/`<X>RemoteDataSource` (solo
  interfaces, sin implementación) creadas para los 23 features de
  datos — 52 archivos nuevos, puramente aditivos.
- **`mappers/`+`dtos/`**: patrón completo (mapper creado y *wireado*
  en la página, DTO preparado) implementado en 6 features de
  referencia — `security`, `settings`, `trust`, `verification`,
  `profile`, `provider_dashboard` — elegidos porque sus páginas
  llamaban `_buildData()` dos veces por build; wirear el mapper
  corrigió ese bug de performance real de paso. Los otros 17 features
  quedan documentados con el mismo patrón listo para aplicar
  mecánicamente.
- **Accesibilidad/performance/i18n**: auditados — `flutter analyze`
  limpio (sin `const` faltante), los 7 `IconButton` de la app ya
  tienen `tooltip`, y la falta de `intl`/`flutter_localizations` queda
  documentada como el primer paso real de i18n (no agregado aquí por
  la restricción de "no agregar dependencias").
- Verificado con `dart format .` (0 cambios), `flutter analyze` (`No
  issues found!`) y `flutter test` (748/748, sin cambios de
  comportamiento — todo el trabajo es aditivo o interno a `_buildData()`).

### Etapa 5 — UX global, microinteracciones y experiencia de usuario (Prompt 55, aprobada y consolidada)

Auditó toda la app buscando rigidez visual y corrigió tres hallazgos
reales: (1) ~18 listas verticales (`NotificationsList`, `OrdersList`,
`ServicesList`, `ScheduleList`, `SearchResults`, `WeeklySchedule` y 5
bucles inline en páginas) animaban toda la lista como un bloque único
en vez de escalonado — se agregó `staggerDelayFor()` (nuevo en
`tokens/app_durations.dart`, junto a `AppDurations.staggerStep`/
`staggerCap`) y cada ítem ahora entra con `FadeIn(delay:
staggerDelayFor(index))` envolviendo un `SlideIn`; (2) el cambio de
pestaña en `AppShellPage` era instantáneo porque el `FadeIn` que
envolvía el `IndexedStack` solo corre una vez al montar — se agregó un
wrapper interno `_TabFade` que cruza-desvanece el destino activo en
cada cambio sin desmontar el `IndexedStack` (preserva scroll/estado);
(3) `AppChip(selected: true)` era poco distinguible — ahora tiene
borde + ícono de check animado. También: `AppBadge` cruza su texto con
`AnimatedSwitcher` al cambiar, `AppShellPage` limita el contenido a
1200px en el layout ancho (desktop), y se agregó `.idea/` (raíz) a
`.gitignore` (la carpeta seguía sin ignorar, solo `apps/mobile/.idea/`
lo estaba). Corrigió en el camino un overflow que el cambio de
`AppChip` introdujo en `ProviderSpecialties` a anchos angostos
(`Flexible`+ellipsis). Sin funcionalidades nuevas, sin cambios de
navegación/rutas, sin lógica de negocio, sin tocar branding ni el
logo. Verificado con `dart format .` (0 cambios), `flutter analyze`
(`No issues found!`), `flutter test` (748/748) y `flutter build
windows` (build exitoso).

### Etapa 4 — Refactor global de layouts reutilizables (Prompt 54, aprobada y consolidada)

Auditó `apps/mobile/lib/features` (páginas y widgets, no solo Sprint 2)
buscando estructuras repetidas y extrajo a `core/ui/widgets/` seis
layouts nuevos: `AppPageBody` (raíz de página: header fade-in +
toolbar opcional + body — reemplazó el esqueleto `SingleChildScrollView
+ Column` de ~22 `*_page.dart`), `AppSection` (`AppCard` + `AppSectionTitle`
+ children — reemplazó ese wrapper en `PaymentInformation`,
`ServiceInformation`, `CredentialsSection`, `AuditLogSection`,
`PriceBreakdown`, los seis `*_statistics.dart`, etc.), `AppInfoRow`
(fila etiqueta→valor `spaceBetween`), `AppActionRow` (`Wrap` estándar
de botones — 7 `*_actions.dart`), `AppStatGrid` (`GridView.count` para
tiles de estadísticas, con `crossAxisCount`/`childAspectRatio`
parametrizables para preservar cada proporción original) y
`AppIconRow` (ícono + texto + trailing, con tamaño/color/padding
parametrizables). Migró ~50 archivos sin alterar comportamiento visual
ni navegación; documentó explícitamente los casos **no** migrados
porque forzarlos habría cambiado el comportamiento (`ChatPage`/
`PaymentsPage` con header condicional al estado, `PaymentSummary` con
overflow por `Flexible`+ellipsis, `ScheduleBlockCard` sin ícono, entre
otros — ver `BRANDING.md`, sección "Adopción de layouts (Etapa 4)").
Verificado con `dart format .` (0 cambios), `flutter analyze` (`No
issues found!`), `flutter test` (748/748, sin cambios) y `flutter
build windows` (build exitoso).

### Etapa 3 — Adopción global del Design System (Prompt 53, aprobada y consolidada)

Recorrió **todos** los features de `apps/mobile/lib/features` (no solo
los nuevos) y reemplazó duplicación visual por los componentes
oficiales de `core/ui` construidos en la Etapa 2: adopción de
`AppStatTile` (elimina `_StatTile`/tiles de estadísticas duplicados en
`availability`, `contact_management`, `provider_dashboard`,
`provider_profile`, `provider_services`, `schedule`, `security`),
`AppBadge` (unifica badges de estado ad hoc en `address_management`,
`orders`, `payments`, `provider_services`, `security`, `trust`,
`verification`) y `AppAvatar` (unifica avatares circulares con
iniciales/imagen en `chat`, `home`, `profile`, `provider_profile`).
También se ajustaron `BRANDING.md`/`README.md` de `core/ui` para
documentar el uso real de estos tres componentes y se afinaron
pequeños detalles de los propios `AppAvatar`/`AppBadge`/`AppStatTile`
(parámetros nuevos necesarios para cubrir los casos de uso encontrados
en los features). Sin crear funcionalidades nuevas, sin romper
navegación ni lógica de negocio, sin tocar mocks. **58 archivos
modificados, 394 inserciones / 644 eliminaciones** (reducción neta de
~250 líneas de duplicación). Verificado con `flutter analyze` (`No
issues found!`), `flutter test` (748/748, sin cambios de
comportamiento) y `dart format .`.

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

## Estado del repositorio al cierre de esta sesión (Prompt 45 consolidado, previo al Prompt 46)

Este es el handoff vigente — más reciente que los cuatro bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 45 (`trust`) fue aprobado explícitamente por el
  usuario**, verificado con `flutter analyze` (`No issues found!`),
  `flutter test` (674/674), `dart format .` y `git status`.
- Se creó un **único commit exclusivo del Prompt 45** con el mensaje
  `Prompt 45 - Trust feature completed` (ver `git log -1` para el hash
  exacto — no se fija aquí el hash literal por la misma razón de
  auto-referencia explicada en secciones anteriores). Incluye el
  feature `trust` completo, el cambio mínimo de navegación en
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
  con el **Prompt 46 — Schedule** (siguiente prompt acordado, ver
  sección 10) sin re-verificar nada de los Prompts 19–45.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 46** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 46 consolidado, previo al Prompt 47)

Este es el handoff vigente — más reciente que los cinco bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 46 (`schedule`) fue aprobado explícitamente por el
  usuario**, verificado con `flutter analyze` (`No issues found!`),
  `flutter test` (694/694), `dart format .` y `git status`.
- Se creó un **único commit exclusivo del Prompt 46** con el mensaje
  `Prompt 46 - Schedule feature completed` (ver `git log -1` para el
  hash exacto — no se fija aquí el hash literal por la misma razón de
  auto-referencia explicada en secciones anteriores). Incluye el
  feature `schedule` completo, el cambio mínimo de navegación en
  `provider_dashboard`, y la actualización de este archivo —
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
  con el **Prompt 47 — Contact Management** (siguiente prompt acordado,
  ver sección 10) sin re-verificar nada de los Prompts 19–46.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 47** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 47 consolidado, previo al Prompt 48)

Este es el handoff vigente — más reciente que los seis bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 47 (`contact_management`) fue aprobado explícitamente por
  el usuario**, verificado con `flutter analyze` (`No issues found!`),
  `flutter test` (715/715), `dart format .` y `git status`.
- Se creó un **único commit exclusivo del Prompt 47** con el mensaje
  `Prompt 47 - Contact Management feature completed` (ver `git log -1`
  para el hash exacto — no se fija aquí el hash literal por la misma
  razón de auto-referencia explicada en secciones anteriores). Incluye
  el feature `contact_management` completo, el cambio mínimo en
  `settings` (nueva opción "Contactos" + ajuste al test existente), y
  la actualización de este archivo — **sin incluir
  `Logo oficial grupo.svg`** (branding sigue congelado, ver sección 7).
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
  con el **Prompt 48 — Security** (siguiente prompt acordado, ver
  sección 10) sin re-verificar nada de los Prompts 19–47.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 48** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 48 consolidado, previo al Prompt 49)

Este es el handoff vigente — más reciente que los siete bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 48 (`security`) fue aprobado explícitamente por el
  usuario**, verificado con `flutter analyze` (`No issues found!`),
  `flutter test` (736/736), `dart format .` y `git status`.
- Se creó un **único commit exclusivo del Prompt 48** con el mensaje
  `Prompt 48 - Security feature completed` (ver `git log -1` para el
  hash exacto — no se fija aquí el hash literal por la misma razón de
  auto-referencia explicada en secciones anteriores). Incluye el
  feature `security` completo, el cambio mínimo en `settings` (nueva
  opción "Seguridad" + ajuste al test existente), y la actualización de
  este archivo — **sin incluir `Logo oficial grupo.svg`** (branding
  sigue congelado, ver sección 7).
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
  con el **Prompt 49 — Credentials (extensión de `security`)**
  (siguiente prompt acordado, ver sección 10) sin re-verificar nada de
  los Prompts 19–48.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 49** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 49 consolidado, previo al Prompt 50)

Este es el handoff vigente — más reciente que los ocho bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 49 (`security` extendido con `Credentials`) fue aprobado
  explícitamente por el usuario**, verificado con `flutter analyze`
  (`No issues found!`), `flutter test` (740/740), `dart format .` y
  `git status`.
- Se creó un **único commit exclusivo del Prompt 49** con el mensaje
  `Prompt 49 - Security extended with Credentials` (ver `git log -1`
  para el hash exacto — no se fija aquí el hash literal por la misma
  razón de auto-referencia explicada en secciones anteriores). Incluye
  la extensión completa de `security` (mock/modelo/repositorio/
  widgets/README) — **sin incluir `Logo oficial grupo.svg`** (branding
  sigue congelado, ver sección 7). No hubo cambio de navegación: no se
  tocó ningún otro feature.
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
  con el **Prompt 50 — Audit (extensión de `security`)** (siguiente
  prompt acordado, ver sección 10) sin re-verificar nada de los Prompts
  19–49.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 50** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 50 consolidado, previo al Prompt 51)

Este es el handoff vigente — más reciente que los nueve bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 50 (`security` extendido con `Audit`) fue aprobado
  explícitamente por el usuario**, verificado con `flutter analyze`
  (`No issues found!`), `flutter test` (744/744), `dart format .` y
  `git status`.
- Se creó un **único commit exclusivo del Prompt 50** con el mensaje
  `Prompt 50 - Security extended with Audit` (ver `git log -1` para el
  hash exacto — no se fija aquí el hash literal por la misma razón de
  auto-referencia explicada en secciones anteriores). Incluye la
  extensión completa de `security` (mock/modelo/repositorio/widgets/
  README) — **sin incluir `Logo oficial grupo.svg`** (branding sigue
  congelado, ver sección 7). No hubo cambio de navegación.
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
  con el **Prompt 51 — Attachment (extensión de `chat`)** (siguiente
  prompt acordado, ver sección 10) sin re-verificar nada de los Prompts
  19–50.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que son del Prompt 51** — confirmar con el usuario antes
  de continuar, siguiendo la misma disciplina usada en cada prompt
  anterior.

## Estado del repositorio al cierre de esta sesión (Prompt 51 consolidado — cierre del Sprint 1, inicio del Sprint 2 Branding & UX)

Este es el handoff vigente — más reciente que los diez bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 51 (`chat` extendido con `Attachment`) fue aprobado
  explícitamente por el usuario**, verificado con `flutter analyze`
  (`No issues found!`), `flutter test` (748/748), `dart format .` y
  `git status`. Con este prompt se cierra oficialmente el **Sprint 1**
  (ver la sección dedicada arriba).
- Se creó un **único commit exclusivo del Prompt 51** con el mensaje
  `Prompt 51 - Chat extended with Attachment (Sprint 1 closed)` (ver
  `git log -1` para el hash exacto — no se fija aquí el hash literal
  por la misma razón de auto-referencia explicada en secciones
  anteriores). Incluye la extensión completa de `chat`
  (mock/modelo/repositorio/widgets/README) y la actualización de este
  archivo — **sin incluir `Logo oficial grupo.svg`** (branding sigue
  congelado hasta que el Sprint 2 lo trate explícitamente, ver sección
  7). No hubo cambio de navegación.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza el Sprint 2 — Branding & UX**,
  Etapa 1 (Fundación del Design System oficial): auditoría visual del
  frontend existente, análisis del logo oficial (sin agregarlo al
  repositorio todavía), definición de tokens (paleta con variantes
  50–900, tipografía, espaciados, radios, elevaciones, sombras,
  especificación de animaciones, iconografía, estilos de
  botones/campos/cards/diálogos/bottom sheets/chips) e integración
  mínima de esos tokens en `core/ui/` sin rediseñar ninguna pantalla
  todavía. Ver el resto de este handoff/la respuesta de esa sesión para
  el detalle completo de las decisiones de diseño.
- Si al abrir una nueva sesión `git status` muestra ese commit como el
  más reciente y el working tree está limpio (salvo el
  `Logo oficial grupo.svg` sin trackear, que en esta etapa puede además
  haber sido leído/analizado pero **no agregado**), el estado es
  exactamente el que se describe en este documento.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que corresponden a la siguiente etapa del Sprint 2** —
  confirmar con el usuario antes de continuar, siguiendo la misma
  disciplina usada en cada prompt anterior.

## Estado del repositorio al cierre de esta sesión (Sprint 2 Etapa 1 consolidada, Etapa 2 en curso)

Este es el handoff vigente — más reciente que los once bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **La Etapa 1 del Sprint 2 (fundación del Design System oficial) fue
  aprobada explícitamente por el usuario**, verificada con `flutter
  analyze` (`No issues found!`), `flutter test` (748/748), `dart
  format .` y `git status`.
- Se creó un **único commit exclusivo de esta consolidación** con el
  mensaje `Sprint 2 Etapa 1 - Official branding foundation (tokens
  only, not wired)` (ver `git log -1` para el hash exacto — no se fija
  aquí el hash literal por la misma razón de auto-referencia explicada
  en secciones anteriores). Incluye `BRANDING.md`,
  `app_brand_palette.dart`, `app_typography.dart`, `app_curves.dart`,
  `app_image_size.dart`, el ajuste de `AppIcons.more`, y las animaciones
  refactorizadas para usar `AppCurves` — **sin incluir
  `Logo oficial grupo.svg`** (sigue sin trackear, ver sección 7). Nada
  de esto tocó ningún feature ni el tema activo.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza la Etapa 2 — Aplicación del
  Branding al Core UI**: conectar los tokens de la Etapa 1 al
  `AppTheme` activo (`ColorScheme`/`textTheme`), extender `AppButton`
  con variantes, actualizar `AppTextField`/`AppCard`, y construir
  `AppChip`/`AppDialog`/`AppBottomSheet`/`AppSnackBar`/`AppAvatar`/
  `AppBadge`/`AppLoadingIndicator` — todo dentro de `core/ui/`, sin
  tocar features/navegación. Las pantallas heredan el nuevo tema
  automáticamente.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que corresponden a la siguiente etapa** — confirmar con
  el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Sprint 2 Etapa 2 consolidada, Etapa 3 en curso)

Este es el handoff vigente — más reciente que los doce bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **La Etapa 2 del Sprint 2 (Prompt 52 — aplicación del branding al
  Core UI) fue aprobada explícitamente por el usuario**, verificada con
  `flutter analyze` (`No issues found!`), `flutter test` (748/748),
  `dart format .` y `git status`.
- Se creó un **único commit exclusivo de esta consolidación** con el
  mensaje `Sprint 2 Etapa 2 - Branding wired into AppTheme + new App*
  components` (ver `git log -1` para el hash exacto — no se fija aquí
  el hash literal por la misma razón de auto-referencia explicada en
  secciones anteriores). Incluye `app_theme.dart` reescrito, `AppButton`
  con variantes, y los 8 componentes nuevos — **sin incluir
  `Logo oficial grupo.svg`** (sigue sin trackear, ver sección 7) **ni
  la carpeta `.idea/`** (metadata de IDE, sin relación con el proyecto,
  dejada intacta sin trackear). Ningún feature fue tocado.
- **A partir de esta sesión comienza la Etapa 3 — Adopción global del
  Design System**: reemplazar en todos los features la duplicación
  visual (`_StatTile` y equivalentes, chips/badges/avatares/spinners ad
  hoc, botones Material crudos, diálogos/bottom sheets/snackbars
  manuales, iconografía sin `AppIcons`) por los componentes oficiales
  de `core/ui`. Es un refactor visual, no funcional — sin nuevas
  pantallas, sin cambios de navegación ni de lógica de negocio.
- Si el working tree tiene cambios sin commitear más allá del logo (y
  `.idea/`), **no asumir que corresponden a la siguiente etapa** —
  confirmar con el usuario antes de continuar.
- **A partir de esta sesión, el usuario solicitó un modo de trabajo
  optimizado**: fases grandes (analizar → implementar todo el feature
  → navegación → tests → verificación final única) en vez de narrar
  archivo por archivo, para reducir tiempo y consumo de contexto. La
  disciplina de "1 prompt = 1 commit", el checklist de verificación
  (`dart format`/`flutter analyze`/`flutter test`/`flutter run -d
  windows`) y todas las restricciones arquitectónicas se mantienen
  exactamente iguales — solo cambia el nivel de detalle del reporte
  intermedio, no el proceso de calidad.

## Estado del repositorio al cierre de esta sesión (Prompt 53 consolidado — Sprint 2 Etapa 3 cerrada, Etapa 4 en curso)

Este es el handoff vigente — más reciente que los trece bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 53 (Sprint 2, Etapa 3 — adopción global del Design
  System) fue aprobado explícitamente por el usuario**, verificado con
  `dart format .` (0 cambios), `flutter analyze` (`No issues found!`),
  `flutter test` (748/748) y `git status`.
- Se creó un **único commit exclusivo del Prompt 53** con el mensaje
  `Prompt 53 - Global Design System adoption (AppStatTile/AppBadge/
  AppAvatar)` (ver `git log -1` para el hash exacto — no se fija aquí
  el hash literal por la misma razón de auto-referencia explicada en
  secciones anteriores). Incluye los 58 archivos migrados (ver detalle
  en la sección 4, Sprint 2 Etapa 3) y la actualización de este
  documento — **sin incluir `Logo oficial grupo.svg` ni la carpeta
  `.idea/`** (ambos siguen sin trackear, ver sección 7). No hubo cambio
  de navegación ni de lógica de negocio.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          .idea/
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza la Etapa 4 — Refactor global de
  layouts y estructuras reutilizables** (Prompt 54): auditar
  `apps/mobile/lib/features` en busca de estructuras repetidas (Page
  Headers, Section Headers, Sections, Info Rows, Action Rows, Page
  Padding, Scroll Body), extraer los layouts que realmente aporten
  reutilización a `core/ui/widgets/`, migrar todos los features, limpiar
  código muerto y documentar en `core/ui/README.md`/`BRANDING.md`. Es
  un refactor estructural, no funcional — sin nuevas pantallas, sin
  cambios de navegación ni de lógica de negocio, sin tocar branding ni
  el logo. **Esta etapa queda pendiente de aprobación del usuario antes
  de commitear** (no sigue la disciplina "1 prompt = 1 commit" hasta
  que se apruebe explícitamente).
- Si el working tree tiene cambios sin commitear más allá del logo y
  `.idea/`, **no asumir que corresponden a una etapa posterior a la 4**
  — confirmar con el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Prompt 54 consolidado — Sprint 2 Etapa 4 cerrada, Etapa 5 en curso)

Este es el handoff vigente — más reciente que los catorce bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 54 (Sprint 2, Etapa 4 — refactor global de layouts
  reutilizables) fue aprobado explícitamente por el usuario**,
  verificado con `dart format .` (0 cambios), `flutter analyze` (`No
  issues found!`), `flutter test` (748/748), `flutter build windows` y
  `git status`.
- Se creó un **único commit exclusivo del Prompt 54** con el mensaje
  `Prompt 54 - Global reusable layouts (AppPageBody/AppSection/
  AppInfoRow/AppActionRow/AppStatGrid/AppIconRow)` (ver `git log -1`
  para el hash exacto — no se fija aquí el hash literal por la misma
  razón de auto-referencia explicada en secciones anteriores). Incluye
  los 6 layouts nuevos y los ~50 archivos migrados (ver detalle en la
  sección 4, Sprint 2 Etapa 4) y la actualización de este documento —
  **sin incluir `Logo oficial grupo.svg` ni la carpeta `.idea/`** (ambos
  siguen sin trackear, ver sección 7). No hubo cambio de navegación ni
  de lógica de negocio.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          .idea/
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza la Etapa 5 — UX global,
  microinteracciones y experiencia de usuario** (Prompt 55): auditar
  toda la app en busca de rigidez visual (transiciones inexistentes,
  loaders poco naturales, scrolls abruptos), aplicar
  `FadeIn`/`ScaleIn`/`SlideIn` donde falte (listas, cards, empty
  states), verificar que botones/chips/badges/avatares usen los
  estados Material 3 y las animaciones oficiales, revisar feedback
  (SnackBar/Dialog/BottomSheet) y mejorar la experiencia de escritorio
  (hover/cursor/anchuras) sin tocar responsive. Es trabajo puramente de
  UX — sin funcionalidades nuevas, sin cambios de navegación/rutas, sin
  lógica de negocio, sin tocar branding ni el logo. **Esta etapa queda
  pendiente de aprobación del usuario antes de commitear.**
- Si el working tree tiene cambios sin commitear más allá del logo y
  `.idea/`, **no asumir que corresponden a una etapa posterior a la 5**
  — confirmar con el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Prompt 55 consolidado — Sprint 2 Etapa 5 cerrada, Etapa 6 en curso)

Este es el handoff vigente — más reciente que los quince bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 55 (Sprint 2, Etapa 5 — UX global y microinteracciones)
  fue aprobado explícitamente por el usuario**, verificado con `dart
  format .` (0 cambios), `flutter analyze` (`No issues found!`),
  `flutter test` (748/748), `flutter build windows` y `git status`.
- Se creó un **único commit exclusivo del Prompt 55** con el mensaje
  `Prompt 55 - Global UX polish (staggered lists, tab cross-fade,
  clearer chip selection, desktop max width)` (ver `git log -1` para
  el hash exacto — no se fija aquí el hash literal por la misma razón
  de auto-referencia explicada en secciones anteriores). Incluye los
  22 archivos de la Etapa 5 (ver detalle en la sección 4) y la
  actualización de este documento — **sin incluir `Logo oficial
  grupo.svg`** (sigue sin trackear, ver sección 7). `.idea/` (raíz) ya
  no aparece como pendiente: se agregó a `.gitignore` en esta misma
  etapa (la carpeta en sí no se tocó). No hubo cambio de navegación ni
  de lógica de negocio.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza la Etapa 6 — Preparación para
  Backend (Frontend Infrastructure)** (Prompt 56), un hito
  deliberadamente más grande que las etapas anteriores, decisión
  explícita del usuario: auditar y estandarizar el patrón de
  repositorios en los 30 features, agregar capas `datasources/`
  (interfaces `LocalDataSource`/`RemoteDataSource`, sin
  implementación) y `mappers/` (Domain → Display, eliminando
  conversiones manuales), preparar DTOs (solo estructura, sin
  JSON/HTTP), reducir acoplamiento, y auditar
  performance/accesibilidad/i18n — todo sin agregar backend, HTTP,
  Firebase ni gestión de estado (Provider/Riverpod/Bloc/GetX), sin
  romper tests, sin cambiar navegación/UX/branding. **Esta etapa queda
  pendiente de aprobación del usuario antes de commitear.**
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que corresponden a una etapa posterior a la 6** —
  confirmar con el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Prompt 56 consolidado — Sprint 2 cerrado, preparación de Sprint 3 en curso)

Este es el handoff vigente — más reciente que los dieciséis bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 56 (Sprint 2, Etapa 6 — preparación para backend) fue
  aprobado explícitamente por el usuario**, verificado con `dart
  format .` (0 cambios), `flutter analyze` (`No issues found!`),
  `flutter test` (748/748), `flutter build windows` y `git status`.
- Se creó un **único commit exclusivo del Prompt 56** con el mensaje
  `Prompt 56 - Frontend infrastructure prep for backend (datasources,
  mappers, DTOs)` (ver `git log -1` para el hash exacto — no se fija
  aquí el hash literal por la misma razón de auto-referencia explicada
  en secciones anteriores). Incluye `apps/mobile/ARCHITECTURE.md`,
  `datasources/` en los 23 features de datos, `mappers/`+`dtos/`
  wireados en los 6 features de referencia, el fix de estandarización
  en `categories`/`marketplace`, y la actualización de este documento
  — **sin incluir `Logo oficial grupo.svg`, archivos de IDE ni
  temporales**. No hubo cambio de navegación, UX ni branding.
- **Con este commit se cierra oficialmente el Sprint 2** (Branding &
  UX, Etapas 1–6, Prompts 52–56).
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza la preparación de Sprint 3**
  (Prompt 57): auditoría de los 17 features sin `mapper`/`dto` (¿se
  pueden migrar con el mismo patrón?), auditoría arquitectónica
  completa buscando bloqueos para empezar el backend, revisión crítica
  de riesgos de tener que rehacer trabajo, y creación de
  `SPRINT3_PREPARATION.md` con el estado real del proyecto y el
  roadmap de Sprint 3. **Es trabajo de análisis y documentación —
  ningún archivo de Flutter se modifica.** `SPRINT3_PREPARATION.md`
  queda sin commitear, pendiente de aprobación del usuario.
- Si el working tree tiene cambios sin commitear más allá del logo y
  `SPRINT3_PREPARATION.md`, **no asumir que corresponden a Sprint 3** —
  confirmar con el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Prompt 57 consolidado — Sprint 2 cerrado definitivamente, Sprint 3 Etapa 1 en curso)

Este es el handoff vigente — más reciente que los diecisiete bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 57 (cierre definitivo de Sprint 2 + preparación de
  Sprint 3) fue aprobado explícitamente por el usuario**, verificado
  con `dart format .` (0 cambios), `flutter analyze` (`No issues
  found!`), `flutter test` (748/748), `flutter build windows` y `git
  status`.
- Se creó un **único commit exclusivo del Prompt 57** con el mensaje
  `Prompt 57 - Sprint 2 close + Sprint 3 preparation (audit +
  SPRINT3_PREPARATION.md)` (ver `git log -1` para el hash exacto — no
  se fija aquí el hash literal por la misma razón de auto-referencia
  explicada en secciones anteriores). Incluye `SPRINT3_PREPARATION.md`
  y la actualización de este documento — **sin incluir `Logo oficial
  grupo.svg`** (sigue sin trackear, ver sección 7). Ningún archivo de
  Flutter cambió de comportamiento.
- `git status` tras el commit quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza Sprint 3 — Etapa 1: Shared
  Kernel + Infraestructura Backend** (Prompt 58): primer trabajo real
  sobre `apps/backend` (NestJS) desde el cierre de Sprint 1 —
  implementar el Shared Kernel (solo value objects/clases realmente
  reutilizadas por el dominio, justificadas contra los 22 módulos
  existentes, no por analogía), infraestructura base de dominio,
  jerarquía de excepciones, validadores, y bootstrap de NestJS
  (`main.ts`, `app.module.ts`, `config/`, `logger/`, `filters/`,
  `pipes/`, `interceptors/`) — **sin implementar JWT, HTTP,
  Controllers, Services, Repositories reales, base de datos, Prisma,
  TypeORM ni Firebase**, y **sin tocar Flutter ni reemplazar ningún
  mock todavía**. **Esta etapa queda pendiente de aprobación del
  usuario antes de commitear.**
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que corresponden a una etapa posterior** — confirmar con
  el usuario antes de continuar.

## Estado del repositorio al cierre de esta sesión (Prompt 58 consolidado — Sprint 3 Etapa 1 cerrada, Etapa 2 en curso)

Este es el handoff vigente — más reciente que los dieciocho bloques
anteriores (que se conservan como registro histórico, sin eliminar).

- **El Prompt 58 (Sprint 3, Etapa 1 — Shared Kernel + Infraestructura
  Backend) fue aprobado explícitamente por el usuario**, verificado
  con `npm run build`, `npm run lint`, `jest` (132/132), `jest e2e`
  (1/1), `dart format .`, `flutter analyze`, `flutter test` (748/748)
  y `flutter build windows`.
- Se creó un **único commit exclusivo del Prompt 58** con el mensaje
  `Prompt 58 - Shared Kernel review + NestJS bootstrap infrastructure`
  (ver `git log -1` para el hash exacto — no se fija aquí el hash
  literal por la misma razón de auto-referencia explicada en secciones
  anteriores). Incluye la jerarquía de excepciones nueva en
  `modules/core/domain/exceptions/`, `config/`, `common/` (logger,
  filters, interceptors, pipes/middlewares reservados),
  `.env.example`, y la actualización de `modules/core/README.md` y de
  este documento — **sin incluir `Logo oficial grupo.svg`**. Ningún
  archivo de Flutter cambió.
- **Decisión de persistencia tomada en esta sesión (Prompt 59)**: el
  usuario confirmó **Prisma + PostgreSQL** como estrategia oficial de
  persistencia del proyecto a partir de Sprint 3 — no había ninguna
  decisión previa documentada (Fase 5 del Prompt 59 pedía "elegir la
  estrategia ya definida por el proyecto", pero no existía; se
  preguntó explícitamente al usuario en vez de asumir). Domain y
  Application permanecen 100% independientes de Prisma — todo código
  específico de Prisma vive exclusivamente en `infrastructure/` de
  cada módulo, vía repositorios/mappers/adaptadores.
- `git status` tras el commit del Prompt 58 quedó exactamente:
  ```
  On branch main
  Untracked files:
          Logo oficial grupo.svg
  nothing added to commit but untracked files present
  ```
- **A partir de esta sesión comienza Sprint 3 — Etapa 2: Identity &
  Access (Backend)** (Prompt 59): primer bounded context implementado
  completo — Domain (ya existía) → Application (use cases reales,
  commands, queries, ports, DTOs, mappers, validadores) →
  Infrastructure (repositorios reales con Prisma, mappers, adaptadores,
  factories) → Persistencia (schema Prisma, migraciones reales
  generadas contra PostgreSQL en Docker, seeds, configuración) → Tests.
  **Sin Controllers/endpoints todavía, sin JWT/login/registro, sin
  tocar Flutter.** Esta etapa queda pendiente de aprobación del
  usuario antes de commitear.
- Si el working tree tiene cambios sin commitear más allá del logo,
  **no asumir que corresponden a una etapa posterior** — confirmar con
  el usuario antes de continuar.
