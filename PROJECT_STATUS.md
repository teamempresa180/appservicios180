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

### Core UI (Design System) — ✅ completo (`lib/core/ui/`)
- `theme/app_theme.dart`: paleta 100% neutra (`AppColors`: background
  `#FFFFFF`, surface `#F8F8F8`, divider `#E5E5E5`, texto primario
  `#111111`, texto secundario `#666666`, error `#B00020`). Tipografía:
  Roboto (fuente del sistema, sin assets).
- `tokens/`: spacing, radius, elevation, durations.
- `widgets/`: AppButton, AppTextField, AppCard, AppLoading, AppEmptyState,
  AppDivider, AppSectionTitle, AppScaffold.
- `animations/`: FadeIn, ScaleIn, SlideIn (sin Lottie/Rive).
- `icons/`: AppIcons (solo Material Icons).
- `extensions/`: helpers de tema y espaciado.

### Navegación + Splash — ✅ completo (`lib/core/navigation/` + `lib/features/`)
- `GoRouter` configurado en `core/navigation/router/app_router.dart`.
- Rutas registradas: `/` (Splash), `/onboarding`, `/login`, `/register`,
  `/home` — todas placeholder salvo Splash.
- `guards/app_route_guard.dart`: guard "siempre permite", punto de
  extensión para autenticación futura (no implementada).
- `SplashPage`: muestra "AppServicios" + "Inicializando..." (AppLoading),
  espera 2s y navega a `/onboarding` automáticamente.
- Placeholders Onboarding/Login/Register/Home: solo `AppScaffold` +
  `AppSectionTitle` + `AppCard` + texto "En construcción". Sin
  formularios, sin botones, sin lógica.
- `main.dart` reescrito: `MaterialApp.router` + `AppTheme.light` +
  `AppRouter.router`.
- Dependencia agregada: `go_router: ^14.6.2` (resuelta a 14.8.1).

### Verificación Flutter (último estado conocido)
```
dart analyze    ✅ No issues found!
flutter test    ✅ 105/105 tests
flutter run -d windows   ✅ compila y corre sin errores
```

**Nota de entorno importante**: `flutter analyze` falla con un crash del
analysis server por el símbolo `°` en la ruta `Grupo empresarial 180°`
(bug de entorno, no del código). Usar **`dart analyze`** como equivalente
confiable en este proyecto — ya verificado que da los mismos resultados.

### Lo que NO existe todavía en Flutter
Gestión de estado (Provider/Riverpod/Bloc/Cubit/ViewModels), consumo de
API, conexión a backend, Login/Registro/Home funcionales, Drawer,
BottomNavigation, Tabs, identidad visual real.

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

## 7. Branding (pendiente)

**No existe identidad visual oficial.** No crear logo, colores de marca,
tipografía corporativa ni iconografía propia hasta que el usuario la
proporcione explícitamente. Cuando exista, el único archivo a tocar es
`lib/core/ui/theme/app_theme.dart` (ver su propio README para el
procedimiento).

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

**Prompt 18 — Flutter: Navegación Base + Splash (primer prototipo
ejecutable)**. Completado y verificado (build, analyze, test, run).

## 10. Siguiente prompt sugerido

**Prompt 19 — Construcción real de la pantalla Onboarding** (o el nombre
que le dé el usuario), siguiendo el mismo patrón: reutilizar `core/ui`,
sin gestión de estado todavía, sin conectar backend. Después, en orden
natural: Login → Registro → Home, y solo entonces evaluar cuándo introducir
gestión de estado (Provider/Riverpod/Bloc — a decidir con el usuario) y la
primera conexión real al backend (probablemente empezando por
Identity/Authentication, el Bounded Context base).

## 11. Sugerencia de versionado (aún no aplicada)

El usuario propuso etiquetar hitos con tags de git:
`v0.1.0` (arquitectura completa) → `v0.2.0` (Application + Presentation +
Core UI) → `v0.3.0` (Navegación + Splash) → `v0.4.0` (Onboarding) →
`v0.5.0` (Login) → `v0.6.0` (Registro) → `v0.7.0` (Home). Aún no se ha
creado ningún tag — es una recomendación pendiente de aplicar.
