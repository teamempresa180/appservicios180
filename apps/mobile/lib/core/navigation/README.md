# Core Navigation

## Filosofía de navegación

La navegación de la aplicación tiene un único punto de verdad: `AppRouter`
(`router/app_router.dart`), construido sobre `GoRouter`. Ninguna pantalla
debe navegar con `Navigator.push` directo ni conocer rutas escritas a mano
— siempre se usa `context.go(AppRoutes.x)` con las constantes de
`routes/app_routes.dart`. Esto mantiene todas las rutas centralizadas,
tipadas y fáciles de auditar a medida que la aplicación crezca.

## Cómo agregar nuevas rutas

1. Agregar la constante del path en `routes/app_routes.dart`.
2. Agregar el `GoRoute` correspondiente en `router/app_router.dart`,
   apuntando a la página de la feature.
3. Nunca escribir el string de la ruta directamente en un `context.go(...)`
   — siempre referenciar la constante de `AppRoutes`.

## Cómo agregar nuevos módulos (features)

Cada nueva feature de negocio debe seguir la misma estructura ya usada por
`splash`, `onboarding`, `login`, `register` y `home`:

```
features/<nombre>/
  presentation/
    pages/
    widgets/   (si la pantalla necesita widgets propios)
```

La página se registra en el router como cualquier otra ruta — la
navegación nunca necesita conocer la estructura interna de la feature.

## Por qué aún no existen Guards reales

`guards/app_route_guard.dart` define únicamente el punto de extensión:
`AppRouteGuard.redirect()` siempre retorna `null`, permitiendo la
navegación sin restricciones. Todavía no existe autenticación ni gestión de
permisos en la aplicación (eso llegará junto con la integración real del
backend), así que implementar un guard funcional ahora solo simularía una
regla de negocio inexistente. Cuando exista, la lógica se agrega
exclusivamente dentro de ese método, sin tocar `AppRouter`.

## Por qué las pantallas son placeholders

Onboarding, Login, Register y Home todavía no tienen diseño, flujo ni
conexión a datos reales — solo existen para que la navegación completa sea
verificable de punta a punta (Splash → Onboarding, y las demás rutas
accesibles). Cada placeholder reutiliza únicamente los widgets ya
existentes de `core/ui` (`AppScaffold`, `AppSectionTitle`, `AppCard`), sin
formularios, botones ni lógica, para no anticipar decisiones de diseño o de
negocio que aún no se han tomado.

## Estructura

```
core/navigation/
  README.md
  router/
    app_router.dart
  routes/
    app_routes.dart
  guards/
    app_route_guard.dart
```

## Qué NO contiene

Lógica de autenticación, permisos reales, gestión de estado (Provider,
Riverpod, Bloc, Cubit, ViewModels), consumo de API, conexión a backend,
Drawer, BottomNavigation ni Tabs.
