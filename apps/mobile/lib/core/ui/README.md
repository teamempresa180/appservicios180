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
