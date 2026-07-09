# Core UI — Design System Base

## Filosofía del Design System

Este directorio es la única fuente de verdad para cómo se ve la aplicación:
colores, tipografía, espaciados, radios, elevaciones, duraciones de
animación, iconografía y los widgets base reutilizables. Ninguna pantalla
de negocio debería definir un color, un padding "mágico" o un radio de
borde por su cuenta — siempre debe consumir un token o un widget de aquí.

Todo lo construido en esta fase es **deliberadamente neutro y genérico**:
ningún archivo menciona clientes, proveedores, servicios, pedidos ni ningún
otro concepto de negocio. Un widget como `AppButton` o `AppCard` debe poder
usarse igual en esta aplicación que en cualquier otra — su única
responsabilidad es aplicar el tema de forma consistente.

## Componentes existentes

| Widget | Para qué | Notas relevantes |
|---|---|---|
| `AppScaffold` | Estructura de página genérica (título opcional, body, FAB). | No soporta `bottomNavigationBar`/`NavigationRail` — el `AppShell` construye su propio `Scaffold` de Flutter para eso. |
| `AppCard` | Contenedor de contenido. | `elevation` (opcional, default `AppElevation.level1`) da una sombra sutil sin perder el borde neutro. |
| `AppButton` | Botón primario. | Estados: normal, pressed (automático de Material), disabled (`onPressed: null`), loading (`isLoading: true`, cross-fade suave al spinner). Altura mínima uniforme (48). |
| `AppTextField` | Campo de texto. | `prefixIcon`/`suffixIcon` opcionales (Material Icons / widgets). Focus, error y disabled ya tienen bordes distintos vía el tema — no hace falta configurarlos por pantalla. |
| `AppLoading` | Indicador de carga centrado. | `strokeCap: round` (look Material 3); el mensaje aparece con `FadeIn`. |
| `AppEmptyState` | Estado vacío (sin resultados, sin datos). | `actionLabel`/`onActionPressed` opcionales renderizan un `AppButton`. |
| `AppSectionTitle` | Encabezado de sección. | `subtitle` opcional; `actionLabel`/`onActionTap` renderizan un "Ver todo" (`trailing` sigue disponible y tiene prioridad si se pasa). |
| `AppDivider` | Separador con espaciado vertical consistente. | — |
| `FadeIn` / `ScaleIn` / `SlideIn` | Animaciones de entrada. | Únicas animaciones permitidas — no crear nuevas sin aprobación. |

## Buenas prácticas

- Consumir siempre un widget `App*` existente antes de construir algo con
  Material puro (`Card`, `TextFormField`, `ElevatedButton`, etc.) — si el
  widget existente no alcanza, primero considerar si un parámetro opcional
  nuevo lo resolvería (como se hizo aquí con `prefixIcon`/`suffixIcon` en
  `AppTextField`) antes de salir del Design System.
- Todo espaciado, radio, elevación o duración debe venir de
  `AppSpacing`/`AppRadius`/`AppElevation`/`AppDurations` — nunca un número
  suelto (`16.0`, `EdgeInsets.all(12)`) escrito directamente en una
  pantalla o widget de negocio.
- Los parámetros nuevos que se agreguen a un widget `App*` deben ser
  **opcionales con default seguro**, para que las pantallas existentes
  seguir compilando y funcionando sin cambios.

## Cuándo reutilizar

- Si dos o más pantallas necesitan el mismo patrón visual (tarjeta con
  ícono + título + descripción, lista con estado vacío, encabezado con
  acción "Ver todo"), ese patrón pertenece aquí, no duplicado en cada
  feature.
- Si un widget de negocio necesita un ícono, siempre `Icons.*` (Material)
  — nunca un asset.
- Si una pantalla necesita una animación de entrada, usar `FadeIn`,
  `ScaleIn` o `SlideIn` existentes — no escribir una animación custom por
  pantalla.

## Qué NO debe hacerse

- No definir colores, tipografías o radios directamente en una pantalla —
  siempre a través del tema o los tokens.
- No agregar paquetes externos de UI (animaciones, iconos, temas) sin
  aprobación explícita del usuario.
- No romper la firma pública de un widget `App*` existente (parámetros
  requeridos, tipos) — las mejoras se agregan como parámetros opcionales
  nuevos, nunca renombrando o quitando los existentes.
- No introducir branding: logos, colores corporativos, tipografía propia,
  ilustraciones o imágenes. La paleta y tipografía deben seguir siendo
  neutras hasta que exista una identidad visual oficial aprobada.
- No agregar lógica de negocio a ningún widget de `core/ui` — solo
  presentación.

## Qué queda pendiente cuando exista branding oficial

- Reemplazar `AppColors` en `theme/app_theme.dart` por la paleta de marca.
- Cambiar `fontFamily` en `AppTheme.light` (y agregar la fuente como asset
  si no es del sistema).
- Revisar si la marca requiere más de un color de énfasis en el
  `ColorScheme` (hoy solo hay `primary`/`secondary` neutros).
- Decidir si el logo aparece en `SplashPage` y/o en `AppTopBar` (del
  feature `app_shell`) — ninguno de los dos lo referencia todavía.
- Ningún widget de `core/ui` debería necesitar cambios de código más allá
  de `app_theme.dart` — ese es precisamente el punto de tener un Design
  System centralizado.

## Cómo agregar nuevos widgets

1. El widget debe vivir en `widgets/` y seguir el prefijo `App*`.
2. Debe consumir el tema (`Theme.of(context)`) y los tokens (`AppSpacing`,
   `AppRadius`, `AppElevation`, `AppDurations`) — nunca valores sueltos
   (`16.0`, `Color(0xFF...)`) escritos directamente en el widget.
3. No debe conocer ningún concepto de negocio ni importar nada fuera de
   `core/`.
4. Debe seguir siendo utilizable sin cambios cuando exista identidad visual
   real (ver siguiente sección).

## Cómo cambiar el tema cuando exista branding

Todo el tema vive en un único lugar: `theme/app_theme.dart`. Cuando exista
identidad visual oficial (logo, colores de marca, tipografía corporativa),
el cambio se limita a:

1. Reemplazar los valores de `AppColors` por la paleta de marca aprobada.
2. Cambiar `fontFamily` en `AppTheme.light` (y agregar la fuente como asset
   si no es una fuente del sistema).
3. Ajustar `ColorScheme` si la marca requiere más de un color de énfasis.

Ningún widget ni pantalla debería necesitar cambios — todos consumen el
tema de forma indirecta, nunca colores o tipografías hardcodeadas.

## Por qué todavía no existe identidad visual

El proyecto aún no tiene logo, colores corporativos, tipografía de marca ni
iconografía personalizada aprobados. Construir un design system sobre una
identidad visual inventada obligaría a rehacer trabajo más adelante. Por
eso esta fase usa exclusivamente una paleta neutra (blanco, grises, un
color de error estándar) y tipografía del sistema (Roboto), dejando el
sistema listo para recibir la marca real sin tocar ningún widget.

## Estructura

```
core/ui/
  README.md
  theme/
    app_theme.dart        (AppColors + AppTheme.light)
  tokens/
    app_spacing.dart
    app_radius.dart
    app_elevation.dart
    app_durations.dart
  widgets/
    app_button.dart
    app_text_field.dart
    app_card.dart
    app_loading.dart
    app_empty_state.dart
    app_divider.dart
    app_section_title.dart
    app_scaffold.dart
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
assets, imágenes, logos ni colores de marca.
