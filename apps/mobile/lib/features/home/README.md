# Home

Home único y adaptable al rol (Cliente / Proveedor), sin ningún dato
real: todo el contenido es simulado. Vive dentro del `AppShell`, en el
slot "Inicio" de su `IndexedStack` — no tiene `Scaffold`, `AppBar` ni
navegación propia; reutiliza el body que el Shell ya provee. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin ilustraciones — solo Material Icons.

## Arquitectura del feature

```
presentation/
  pages/
    home_page.dart              Sin Scaffold propio; elige contenido según el rol
  widgets/
    home_header.dart            "Hola" + nombre simulado
    client_home_content.dart    Contenido específico de Cliente
    provider_home_content.dart  Contenido específico de Proveedor
    quick_categories.dart       Categorías rápidas (mock), scroll horizontal
    recent_services.dart        Servicios recientes (mock)
    provider_summary.dart       Grid de estadísticas del Proveedor
    stat_card.dart              Tarjeta de estadística reutilizable
  models/
    user_role.dart              enum UserRole { client, provider }
  mock/
    mock_user_role.dart         Único punto para cambiar el rol simulado
    mock_home_data.dart         Datos ficticios (nombre, categorías, stats)
```

`HomePage` lee `MockUserRole.current` y decide, con un `switch`, si
construir `ClientHomeContent` o `ProviderHomeContent`. No hay ningún
`if` de UI disperso por otros archivos — la bifurcación por rol ocurre
en un solo lugar.

## Cómo cambiar el rol simulado

Editar la constante en
`presentation/mock/mock_user_role.dart`:

```dart
abstract final class MockUserRole {
  static const UserRole current = UserRole.client; // o UserRole.provider
}
```

Guardar y hacer hot reload/restart — no hay que tocar ningún otro
archivo para alternar entre ambos escenarios.

## Cómo se conectará posteriormente

- **`Provider`** (`apps/backend/src/modules/provider/`): determinará el
  rol real de la sesión (Cliente vs. Proveedor), reemplazando
  `MockUserRole` una vez exista autenticación real.
- **`Service`**: alimentará "Servicios recientes" (Cliente) y
  "Servicios publicados" (Proveedor) con datos reales en vez de
  `MockHomeData.recentServices`/`publishedServices`.
- **`Category`**: reemplazará la lista fija de `QuickCategories` por las
  categorías reales del catálogo.
- **`Order`**: alimentará "Órdenes pendientes" del resumen de Proveedor
  y, más adelante, un historial real para Cliente.
- **`Notification`**: hoy no aparece en el Home en sí (vive en el ícono
  de notificaciones del `AppTopBar`, del feature `app_shell`); cuando
  exista, probablemente aporte un badge/resumen visible desde aquí.

En todos los casos, el patrón esperado es el mismo: sustituir el acceso
a `MockHomeData`/`MockUserRole` por una fuente de datos real (repositorio
o llamada HTTP) inyectada en `HomePage`, sin cambiar la forma de los
widgets de presentación (`ClientHomeContent`, `ProviderHomeContent`,
`QuickCategories`, `RecentServices`, `ProviderSummary`, `StatCard`) —
ellos solo reciben datos ya resueltos, nunca conocen su origen.

## Qué widgets son reutilizables

- **`StatCard`**: genérico, no depende de qué estadística muestra —
  reutilizable para cualquier pantalla futura que necesite tarjetas de
  resumen (p. ej. Perfil).
- **`HomeHeader`**: reutilizable para cualquier pantalla que necesite un
  saludo con avatar + nombre (p. ej. Perfil).
- `ClientHomeContent`, `ProviderHomeContent`, `QuickCategories`,
  `RecentServices` y `ProviderSummary` son específicos del Home, pero
  están separados unos de otros para que cada uno pueda evolucionar
  (o eventualmente moverse a su propio feature — Marketplace, Órdenes)
  sin arrastrar a los demás.

## Qué sigue siendo simulado

Absolutamente todo: el rol (`MockUserRole`), el nombre mostrado, las
categorías, los servicios recientes y las cuatro estadísticas del
Proveedor. No hay ninguna llamada a `apps/backend`, ninguna gestión de
estado (Provider/Riverpod/Bloc/Cubit/ViewModels) y ninguna lógica de
negocio real.
