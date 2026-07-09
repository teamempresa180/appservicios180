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
