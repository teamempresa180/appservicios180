# Core UI — Design System Base

> **Sprint 2 (Branding & UX), Etapa 3**: el branding oficial no solo
> está conectado (Etapa 2) — ya es de **adopción obligatoria** en todo
> el proyecto (Etapa 3). `AppStatTile`, `AppChip`, `AppBadge`,
> `AppAvatar` y las variantes de `AppButton` reemplazaron toda
> duplicación visual real que existía en los features (`_StatTile`
> privados, `ChoiceChip`/`Chip` sueltos, pills de estado repetidos,
> `CircleAvatar` de persona, `TextButton` crudo). Cualquier pantalla
> nueva **debe** usar estos componentes en vez de reconstruirlos — ver
> [`BRANDING.md`](BRANDING.md) para el detalle completo de la
> migración y el origen de cada token en el logo.

> **Sprint 2, Etapa 4**: el Design System ya no cubre solo componentes
> visuales — también cubre **layouts** (estructuras repetidas: raíz de
> página con scroll, secciones tituladas, filas de información/acción,
> grillas de estadísticas). `AppPageBody`, `AppSection`, `AppInfoRow`,
> `AppActionRow`, `AppStatGrid` y `AppIconRow` reemplazaron la
> duplicación estructural que existía en `presentation/pages/*.dart` y
> `presentation/widgets/*.dart` de prácticamente todos los features.
> Toda pantalla/widget nuevo **debe** reutilizar estos layouts en vez
> de reconstruir `SingleChildScrollView`+`Column`, `AppCard`+`Column`+
> `AppSectionTitle`, o un `Row(spaceBetween)` a mano.

> **Sprint 2, Etapa 6**: este documento sigue siendo solo sobre
> presentación (Design System + layouts). El patrón de capas de datos
> (`repositories/`/`datasources/`/`mappers/`/`dtos/`) que prepara el
> frontend para un backend real está documentado aparte, en
> [`apps/mobile/ARCHITECTURE.md`](../../../ARCHITECTURE.md) — no
> afecta a nada de lo que hay en este archivo.

> **Sprint 2, Etapa 5**: microinteracciones y UX global. Las listas
> verticales (`NotificationsList`, `OrdersList`, `ServicesList`,
> `ScheduleList`, `SearchResults`, `WeeklySchedule` y los bucles
> inline de `address_management`/`contact_management`/`security`/
> `reviews`/`settings`) ahora entran con una **animación escalonada**
> (`FadeIn(delay: staggerDelayFor(index))` envolviendo un `SlideIn`
> por ítem) en vez de un único `SlideIn` sobre toda la lista. `AppChip`
> gana un estado seleccionado más claro (borde + ícono de check
> animado) y `AppBadge` cruza suavemente cuando su `label` cambia. Ver
> la sección "Reglas de UX (Etapa 5)" más abajo para el detalle
> completo y qué NO se tocó.

## Filosofía del Design System

Este directorio es la única fuente de verdad para cómo se ve la aplicación:
colores, tipografía, espaciados, radios, elevaciones, duraciones de
animación, iconografía y los widgets base reutilizables. Ninguna pantalla
de negocio debería definir un color, un padding "mágico" o un radio de
borde por su cuenta — siempre debe consumir un token o un widget de aquí.

Los widgets `App*` (`AppButton`, `AppCard`, etc.) siguen siendo
**genéricos**: ningún archivo menciona clientes, proveedores, servicios,
pedidos ni ningún otro concepto de negocio — su única responsabilidad es
aplicar el tema de forma consistente. Lo que cambió en esta Etapa es el
propio tema, no los widgets que lo consumen.

## Componentes existentes

| Widget | Para qué | Notas relevantes |
|---|---|---|
| `AppScaffold` | Estructura de página genérica (título opcional, body, FAB). | No soporta `bottomNavigationBar`/`NavigationRail` — el `AppShell` construye su propio `Scaffold` de Flutter para eso. |
| `AppCard` | Contenedor de contenido. | `elevation` (opcional, default `AppElevation.level1`) da una sombra sutil; el borde de 1px viene del `cardTheme` global. |
| `AppButton` | Botón con 4 variantes. **Obligatorio** — no usar `ElevatedButton`/`FilledButton`/`OutlinedButton`/`TextButton` crudos. | `variant` (`AppButtonVariant.filled`/`tonal`/`outlined`/`text`, default `filled` — retrocompatible). Estados: normal, pressed (automático de Material), disabled (`onPressed: null`), loading (`isLoading: true`, cross-fade suave al spinner). Altura mínima uniforme (48). |
| `AppTextField` | Campo de texto. | `prefixIcon`/`suffixIcon` opcionales (Material Icons / widgets). Focus, error y disabled ya tienen bordes distintos vía el tema — no hace falta configurarlos por pantalla. |
| `AppLoading` | Indicador de carga centrado con mensaje opcional. | Delega en `AppLoadingIndicator`; el mensaje aparece con `FadeIn`. |
| `AppLoadingIndicator` | Solo el spinner circular, sin mensaje. | `strokeCap: round` (look Material 3); tamaño configurable. |
| `AppEmptyState` | Estado vacío (sin resultados, sin datos). | `actionLabel`/`onActionPressed` opcionales renderizan un `AppButton`; ícono default ahora `AppIcons.empty`. |
| `AppSectionTitle` | Encabezado de sección. | `subtitle` opcional; `actionLabel`/`onActionTap` renderizan un "Ver todo" (`trailing` sigue disponible y tiene prioridad si se pasa). |
| `AppDivider` | Separador con espaciado vertical consistente. | Color 100% desde `dividerTheme` — sin cambios de código en esta Etapa. |
| `AppStatTile` | Valor + etiqueta apilados (tarjeta de estadística genérica). **Obligatorio** — no reimplementar un `_StatTile`/`StatisticsTile` privado. | Reemplazó los 7 `_StatTile` idénticos que existían en `security`/`contact_management`/`schedule`/`provider_services`/`availability`/`provider_dashboard`/`provider_profile`. Soporta un `icon` opcional (variante centrada, la única de las 7 que no era idéntica al resto). |
| `AppChip` | Chip genérico (seleccionado/no seleccionado). **Obligatorio** — no usar `Chip`/`ChoiceChip`/`FilterChip`/`InputChip` crudos para chips estándar. | Forma píldora (`AppRadius.radiusPill`). Reemplazó los 5 `ChoiceChip`/`Chip` que existían en `notifications`/`reviews`/`orders`/`request_service`/`provider_profile`. |
| `AppDialog` | Diálogo modal genérico. | `AppDialog.show(...)` — radio 16, elevación `level8`, ancho máximo 400. Ningún feature lo necesita todavía. |
| `AppBottomSheet` | Bottom sheet modal genérico. | `AppBottomSheet.show(...)` — esquinas superiores radio 20, manija de arrastre incluida, elevación `level4`. Ningún feature lo necesita todavía. |
| `AppSnackBar` | SnackBar genérico con 4 tonos semánticos. | `AppSnackBar.show(context, message, type: AppSnackBarType.info/success/warning/error)`. Ningún feature lo necesita todavía. |
| `AppAvatar` | Círculo con iniciales o ícono. **Obligatorio para avatares de persona** — no reconstruir un `CircleAvatar` de usuario a mano. | Reemplazó los 10 `CircleAvatar` de persona que existían en `provider_profile`/`profile`/`reviews`/`chat`/`payments`/`quote`/`request_service`/`service_detail`/`marketplace`/`home`. Sin foto real — placeholder neutro (ver "Qué NO contiene"). |
| `AppBadge` | Pastilla pequeña de estado/conteo. **Obligatorio para badges de estado** — no reconstruir un `Container`+`BoxDecoration` de pill a mano. | 5 tonos semánticos (`neutral`/`info`/`success`/`warning`/`error`) o un `color` ya resuelto por el caller (para status badges que derivan el color de un enum de dominio). Reemplazó los 10 pills de estado duplicados en `orders`/`payments`/`provider_services`/`address_management`/`security`/`contact_management`/`schedule`/`trust`/`verification`. |
| `FadeIn` / `ScaleIn` / `SlideIn` | Animaciones de entrada. | Curvas ahora nombradas en `AppCurves` (`standard`/`playful`) — mismo comportamiento, sin cambios visuales. Únicas animaciones permitidas — no crear nuevas sin aprobación. |
| `AppPageBody` | Raíz de página: header (fade-in) + toolbar opcional (barras de búsqueda, tabs de filtro) + body, dentro de un `SingleChildScrollView`. **Obligatorio** para pantallas de lista/detalle nuevas — no reconstruir `SingleChildScrollView(child: Column(...))` a mano. | Reemplazó el esqueleto idéntico de ~20 `*_page.dart`. No agrega `SafeArea` (las páginas ya viven dentro del `Scaffold`/`SafeArea` del `AppShell`). Deliberadamente **no** usado en `ChatPage`/`PaymentsPage`: en esos dos el header solo debe aparecer en el estado "con datos", no en loading/empty, así que sigue construido a mano dentro de `_buildBody()`. |
| `AppSection` | Bloque de contenido titulado dentro de `AppCard` (`AppSectionTitle` + lista de `children`). **Obligatorio** — no reconstruir `AppCard(child: Column(children: [AppSectionTitle(...), ...]))` a mano. | Reemplazó ese wrapper en la mayoría de widgets "de resumen"/"de información" (`PaymentInformation`, `ServiceInformation`, `CredentialsSection`, `AuditLogSection`, `PriceBreakdown`, los `*_statistics.dart`, etc.). |
| `AppInfoRow` | Fila etiqueta → valor, alineada a los extremos (`spaceBetween`). **Obligatorio** para este patrón — no reconstruir `Row(mainAxisAlignment: spaceBetween, children: [Text(label), Text(value)])`. | `labelStyle`/`valueStyle` opcionales (default `bodyMedium`/`titleMedium`); `padded` opcional agrega el `EdgeInsets.symmetric(vertical: space4)` que usan las filas repetidas en lista (p. ej. `PriceBreakdown`). No forzado en `PaymentSummary` (usa `Flexible`+ellipsis para valores largos, un comportamiento distinto que este widget no reproduce) ni en `ProviderServices` (nombre truncado con `Expanded`+ellipsis) — ver "Qué NO se migró" en `BRANDING.md`. |
| `AppActionRow` | `Wrap` de 2–3 `AppButton` con el `spacing`/`runSpacing` estándar. **Obligatorio** para grupos de acciones — no reconstruir el `Wrap` a mano. | Reemplazó el mismo `Wrap` en los 7 `*_actions.dart` que usaban ese patrón. `ProfileActions` no lo usa (es una `Column` de 3 botones apilados, un patrón distinto). |
| `AppStatGrid` | `GridView.count` (`shrinkWrap`+`NeverScrollableScrollPhysics`) que envuelve una lista de `AppStatTile`. **Obligatorio** para grillas de estadísticas. | `crossAxisCount`/`childAspectRatio` opcionales (default `2`/`1.7`) — cada `*_statistics.dart` conserva su proporción original pasándolos explícitamente cuando difiere (p. ej. `contacts_statistics` usa 3 columnas). |
| `AppIconRow` | Ícono + título (+ subtítulo opcional) + trailing opcional. **Obligatorio** para filas "ícono + texto (+ badge)". | `iconSize`/`iconColor`/`padded`/`verticalPadding`/`crossAxisAlignment` opcionales para que cada caso (`CredentialCard`, `AuditLogEntryCard`, `TrustFactorCard`, `VerificationStepCard`, la fila interna de `ContactCard`/`AuthMethodCard`) conserve su tamaño/color/espaciado original exacto. No forzado en `ScheduleBlockCard` (usa una etiqueta de día, no un ícono). |

## Buenas prácticas

- Consumir siempre un widget `App*` existente antes de construir algo con
  Material puro (`Card`, `TextFormField`, `ElevatedButton`, etc.) — si el
  widget existente no alcanza, primero considerar si un parámetro opcional
  nuevo lo resolvería (como se hizo aquí con `prefixIcon`/`suffixIcon` en
  `AppTextField`, o `variant` en `AppButton`) antes de salir del Design
  System.
- Todo espaciado, radio, elevación, duración o curva debe venir de
  `AppSpacing`/`AppRadius`/`AppElevation`/`AppDurations`/`AppCurves` —
  nunca un número suelto (`16.0`, `EdgeInsets.all(12)`) escrito
  directamente en una pantalla o widget de negocio.
- Todo color debe venir de `AppBrandPalette` (siempre indirectamente, vía
  `Theme.of(context)`/`context.colors.*`) — nunca un `Color(0xFF...)`
  suelto.
- Los parámetros nuevos que se agreguen a un widget `App*` deben ser
  **opcionales con default seguro**, para que las pantallas existentes
  sigan compilando y funcionando sin cambios.

## Cuándo reutilizar

- Si dos o más pantallas necesitan el mismo patrón visual (tarjeta con
  ícono + título + descripción, lista con estado vacío, encabezado con
  acción "Ver todo"), ese patrón pertenece aquí, no duplicado en cada
  feature.
- Si un widget de negocio necesita un ícono, preferir `AppIcons.*` cuando
  exista el equivalente; si no, `Icons.*` (Material) — nunca un asset.
- Si una pantalla necesita una animación de entrada, usar `FadeIn`,
  `ScaleIn` o `SlideIn` existentes — no escribir una animación custom por
  pantalla.

## Qué NO debe hacerse

- No definir colores, tipografías o radios directamente en una pantalla —
  siempre a través del tema o los tokens.
- No agregar paquetes externos de UI (animaciones, iconos, temas) sin
  aprobación explícita del usuario — incluyendo `google_fonts` para la
  tipografía Poppins pendiente (ver `BRANDING.md`).
- No romper la firma pública de un widget `App*` existente (parámetros
  requeridos, tipos) — las mejoras se agregan como parámetros opcionales
  nuevos, nunca renombrando o quitando los existentes.
- No introducir el logo ni ilustraciones/imágenes de marca todavía — la
  identidad visual aprobada es la paleta/tipografía/tokens, no el archivo
  gráfico en sí (`Logo oficial grupo.svg` sigue sin trackear).
- No agregar lógica de negocio a ningún widget de `core/ui` — solo
  presentación.

## Reglas de UX (Etapa 5)

- **Listas verticales**: todo listado de tarjetas/filas (`*_list.dart`,
  o un `for` inline dentro de una página) debe entrar con animación
  **escalonada**, no como bloque único: envolver cada ítem en
  `FadeIn(delay: staggerDelayFor(index), child: SlideIn(child: <Item>))`.
  `staggerDelayFor` (en `tokens/app_durations.dart`) calcula
  `index * AppDurations.staggerStep`, con un tope
  (`AppDurations.staggerCap`) para que una lista larga no siga
  animando ítems mucho después de que el usuario ya hizo scroll. No
  envolver además la lista completa en un `SlideIn`/`FadeIn` adicional
  — sería una animación duplicada sobre la misma entrada.
- **Navegación entre destinos del Shell**: `AppShellPage` usa
  `IndexedStack` para preservar el estado de cada destino (scroll,
  etc.) al cambiar de pestaña — envolverlo en un `FadeIn` normal no
  sirve, porque ese widget solo anima una vez, en el primer build. El
  cross-fade en cada cambio de pestaña lo da un wrapper interno
  (`_TabFade`, privado de `app_shell_page.dart`) que reinicia un
  `AnimationController` cuando cambia el índice seleccionado, sin
  desmontar el `IndexedStack`. No es un componente nuevo de
  `core/ui/animations/` — es la forma correcta de lograr "fade al
  cambiar", que `FadeIn` no cubre por diseño (su delay es de un solo
  disparo).
- **Botones**: ya cubiertos — `AppButton` usa `FilledButton`/
  `FilledButton.tonal`/`OutlinedButton`/`TextButton`, los cuatro
  widgets oficiales de Material 3, así que hover (desktop), focus,
  pressed y ripple ya vienen gratis del framework. No agregar
  `MouseRegion`/`Focus` manuales encima.
- **Chips**: `AppChip(selected: true)` ahora se distingue con un borde
  de `context.colors.primary` y un ícono de check animado (`AnimatedSwitcher`,
  `AppDurations.fast`) además del cambio de color de contenedor — el
  estado seleccionado debe leerse sin depender solo del contraste de
  color.
- **Badges**: `AppBadge` envuelve su texto en un `AnimatedSwitcher`
  (`AppDurations.fast`) para que un cambio de `label` (p. ej. un
  conteo que se actualiza) haga un cruce suave en vez de un salto
  instantáneo.
- **Loading/Empty/Feedback**: ya estaban unificados antes de esta
  etapa — los 17 `*_loading.dart` de cada feature reutilizan
  `AppLoading`, los 18 `*_empty_state.dart` reutilizan `AppEmptyState`
  (que ya anima su ícono con `ScaleIn`), y ningún feature construye un
  `SnackBar`/`showDialog`/`showModalBottomSheet` a mano — todos usan
  (o no necesitan todavía) `AppSnackBar`/`AppDialog`/`AppBottomSheet`.
  Auditado en esta etapa, sin cambios necesarios.
- **Desktop**: `AppShellPage` centra y limita el contenido a
  `maxContentWidth` (1200) en el layout ancho (`AppNavigationRail`,
  ≥900px) para que las tarjetas no se estiren de borde a borde en una
  ventana de Windows maximizada — el breakpoint/switch de layout en sí
  no cambió. Hover/cursor/scroll en escritorio ya funcionan gratis vía
  Material (`InkWell`/`FilledButton`/etc. muestran `SystemMouseCursors.click`;
  el scroll con rueda del mouse y la scrollbar de escritorio los da
  `ScrollConfiguration` por defecto) — auditado, sin cambios
  necesarios.
- **Qué NO se tocó**: `ChatMessages` (lista de una conversación ya
  existente, no "ítems apareciendo" — un stagger ahí leería como si
  los mensajes se escribieran en cascada, confuso) y
  `RecentOrders`/`PendingRequests` (filas de texto cortas dentro de
  una sola `AppSection` del dashboard, ya animada como bloque) se
  dejaron sin stagger deliberadamente.

## Cómo agregar nuevos widgets

1. El widget debe vivir en `widgets/` y seguir el prefijo `App*`.
2. Debe consumir el tema (`Theme.of(context)`) y los tokens (`AppSpacing`,
   `AppRadius`, `AppElevation`, `AppDurations`, `AppCurves`) — nunca
   valores sueltos (`16.0`, `Color(0xFF...)`) escritos directamente en el
   widget.
3. No debe conocer ningún concepto de negocio ni importar nada fuera de
   `core/`.

## Estructura

```
core/ui/
  README.md
  BRANDING.md                (Sprint 2 — identidad oficial completa)
  theme/
    app_theme.dart           (AppTheme.light — construye ColorScheme/textTheme desde la paleta oficial)
    app_brand_palette.dart   (AppBrandPalette — paleta oficial, 9 colores × escala 50–900)
    app_typography.dart      (AppTypography — tipografía oficial Display/Headline/Title/Body/Label)
  tokens/
    app_spacing.dart
    app_radius.dart           (+ radiusPill, para AppChip)
    app_elevation.dart
    app_durations.dart
    app_curves.dart          (AppCurves — curvas nombradas usadas por las animaciones)
    app_image_size.dart      (AppImageSize — escala oficial, aún no retro-aplicada en features)
  widgets/
    app_button.dart          (+ AppButtonVariant: filled/tonal/outlined/text)
    app_text_field.dart
    app_card.dart
    app_loading.dart
    app_loading_indicator.dart (nuevo)
    app_empty_state.dart
    app_divider.dart
    app_section_title.dart
    app_scaffold.dart
    app_stat_tile.dart        (nuevo)
    app_chip.dart             (nuevo)
    app_dialog.dart           (nuevo)
    app_bottom_sheet.dart     (nuevo)
    app_snack_bar.dart        (nuevo)
    app_avatar.dart           (nuevo)
    app_badge.dart            (nuevo)
    app_page_body.dart        (nuevo — Etapa 4, layout)
    app_section.dart          (nuevo — Etapa 4, layout)
    app_info_row.dart         (nuevo — Etapa 4, layout)
    app_action_row.dart       (nuevo — Etapa 4, layout)
    app_stat_grid.dart        (nuevo — Etapa 4, layout)
    app_icon_row.dart         (nuevo — Etapa 4, layout)
  animations/
    fade_in.dart
    scale_in.dart
    slide_in.dart
  icons/
    app_icons.dart
  extensions/
    context_theme_extensions.dart
    spacing_extensions.dart
```

## Qué NO contiene

Pantallas, navegación, splash, login, home, gestión de estado (Provider,
Riverpod, Bloc, Cubit, ViewModels), consumo de API, conexión a backend,
assets, imágenes reales, el logo oficial (sigue sin trackear en la raíz
del repositorio, reservado para cuando se decida usarlo en `SplashPage`/
`AppTopBar` — ver `BRANDING.md`, punto 8).
