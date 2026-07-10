# App Shell

Marco de navegación reutilizable (top bar + área de contenido + barra de
navegación responsiva) que alojará **todas** las pantallas principales de
la aplicación una vez autenticado el usuario. Reutiliza
exclusivamente el Design System existente (`AppCard`, `AppDivider`,
`AppSectionTitle`, `AppSpacing`, `FadeIn`/`ScaleIn`). Sin identidad
visual propia: sin logo, sin colores de marca, sin ilustraciones —
título temporal "AppServicios" en texto plano y solo Material Icons.

**Actualización (feature `profile`, Prompt 38)**: el slot "Perfil"
(índice 4) ya no muestra `ShellPlaceholder` — ahora aloja `ProfilePage`
directamente, el único cambio autorizado en ese prompt. "Órdenes" y
"Mensajes" siguen mostrando `ShellPlaceholder` hasta que sus propios
prompts los conecten de la misma forma.

## Arquitectura del feature

```
presentation/
  pages/
    app_shell_page.dart          Orquesta top bar + IndexedStack + nav responsiva
  widgets/
    app_top_bar.dart             AppBar temporal + acción "Notificaciones"
    app_bottom_navigation.dart   NavigationBar (Material 3) para móvil
    app_navigation_rail.dart     NavigationRail para tablet/desktop
    navigation_destination_item.dart  Resuelve icon/selectedIcon, compartido por ambas
    shell_placeholder.dart       Placeholder configurable (icon/title/description)
  models/
    shell_navigation_item.dart   Dato plano {icon, selectedIcon, label, index}
```

`AppShellPage` construye su propio `Scaffold` de Flutter (no
`AppScaffold` de `core/ui`): `AppScaffold` no expone un slot para
`bottomNavigationBar` ni soporta un layout de `Row` con `NavigationRail`
— no fue diseñado para alojar una navegación persistente. No se modificó
`core/ui` para agregarle ese soporte. Todo el **contenido** que vive
dentro del Shell (`ShellPlaceholder`) sí reutiliza `AppCard`,
`AppDivider`, `AppSectionTitle` y `AppSpacing` como se pidió.

## Motivo del uso de IndexedStack

El body usa `IndexedStack(index: _selectedIndex, children: [...])` en
vez de, por ejemplo, mostrar condicionalmente un solo widget según el
índice. La diferencia importa: `IndexedStack` **construye y mantiene
vivos** los cinco hijos todo el tiempo, solo oculta los que no
corresponden al índice actual. Eso significa que cuando cada slot tenga
su pantalla real (con scroll, filtros, formularios parcialmente
llenados, etc.), cambiar de pestaña y volver **no reinicia su estado** —
exactamente el comportamiento esperado de una barra de navegación
inferior tipo app nativa. Hoy, con placeholders sin estado propio, esto
no es observable a simple vista, pero la estructura ya está preparada
para cuando sí lo tengan (ver la sección de verificación más abajo, que
confirma esto con un test).

## Cómo se integrará posteriormente con GoRouter

Hoy, `_onDestinationSelected` en `AppShellPage` solo actualiza
`_selectedIndex` localmente (`setState`) — **no navega** vía `GoRouter`.
Ninguna de las cinco secciones (Inicio, Buscar, Órdenes, Mensajes,
Perfil) tiene una ruta propia registrada en `AppRouter` todavía.

La integración real, cuando llegue el momento, adoptará probablemente
`StatefulShellRoute.indexedStack` de `go_router` — una API pensada
exactamente para este caso: un Shell persistente con una rama de
navegación por destino, cada una con su propio `Navigator` y pila de
historial, sin reconstruir el Shell al cambiar de pestaña. En ese punto:
- `_onDestinationSelected` pasaría de `setState` a
  `navigationShell.goBranch(index)`.
- `_selectedIndex` dejaría de vivir en `AppShellPage` y vendría del
  `StatefulShellRouteState` que expone `go_router`.
- El `IndexedStack` manual de hoy sería reemplazado por el que
  `StatefulShellRoute.indexedStack` ya construye internamente.
- Cada `ShellPlaceholder` sería reemplazado por su pantalla real, servida
  por su propia sub-ruta (p. ej. `/home`, `/search`, `/orders`,
  `/chat`, `/profile`).

## Cómo permitirá Home Cliente y Home Proveedor sin romper la navegación

`AppShellPage` no sabe nada sobre roles — la lista
`AppShellPage.navigationItems` es genérica a propósito. Cuando existan
Home Cliente y Home Proveedor, el slot de índice `0` ("Inicio") del
`IndexedStack` decidirá cuál de los dos construir (probablemente en
tiempo de build, según el rol de la sesión activa, una vez exista
autenticación real). El resto del Shell —top bar, navegación, los otros
cuatro slots— no cambia: la decisión de rol queda encapsulada en un solo
punto (qué widget ocupa el índice 0), no se propaga al resto de la
estructura.

## Cómo soportará deep links en el futuro

Con `StatefulShellRoute` de `go_router`, un deep link como
`/orders/42` resolvería primero la rama "Órdenes" (seleccionando
automáticamente ese índice en la navegación, sin que el usuario tenga
que tocar nada) y luego, dentro de esa rama, la sub-ruta de detalle
(`42`) usando el `Navigator` propio de esa rama — sin afectar el estado
de las otras cuatro pestañas gracias al mismo `IndexedStack` interno que
ya usa `StatefulShellRoute.indexedStack`. Es decir: el diseño actual
(un índice por destino + estado preservado) es exactamente el modelo
mental que `go_router` espera para que los deep links aterricen en la
pestaña correcta sin perder el resto de la navegación.

## AppBar preparado para futuras adiciones

`AppTopBar` no implementa avatar, badge de notificaciones ni buscador
todavía (a propósito), pero su estructura ya deja claro dónde encajará
cada uno cuando se construyan:
- **Avatar**: como `leading` del `AppBar` interno.
- **Badge de notificaciones**: envolviendo el `Icon` actual del
  `IconButton` de notificaciones (p. ej. con un `Badge` de Material 3).
- **Buscador**: reemplazando el `title` actual cuando esté activo, o
  como una acción adicional que expanda un `TextField`.

## Estado

Únicamente `StatefulWidget` + `setState` (`_selectedIndex` en
`_AppShellPageState`). Sin Provider/Riverpod/Bloc/Cubit/GetX/MobX/
ViewModels.

## Qué falta para que esto sea real

- Pantallas reales para cada destino (Home, Marketplace, Órdenes, Chat,
  Perfil) — explícitamente fuera de alcance de este prompt.
- Migrar a `StatefulShellRoute.indexedStack` de `go_router` cuando esas
  pantallas existan y necesiten sus propias sub-rutas/deep links.
- Avatar, badge de notificaciones y buscador reales en `AppTopBar`.
- Diferenciar Home Cliente vs. Home Proveedor según el rol de sesión.
