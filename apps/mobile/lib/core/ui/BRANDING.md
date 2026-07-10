# Servicios 180° — Branding oficial (Sprint 2, Etapa 1)

Este documento es la fuente de verdad de la identidad visual oficial de
**Servicios 180°**, construida a partir del análisis de
`Logo oficial grupo.svg` (raíz del repositorio — sigue **sin trackear**
a propósito, ver `PROJECT_STATUS.md` sección 7). Define **tokens y
especificaciones**; la aplicación consistente de esta identidad a todas
las pantallas existentes es una Etapa posterior del Sprint 2, no esta.

## Identidad

- **Nombre oficial**: Servicios 180°
- **Estilo**: elegante, minimalista, profesional
- **Origen visual**: el logo combina numerales estilizados en gradientes
  dorado/bronce con un acento plateado/gris metálico, y el texto
  "GRUPO EMPRESARIAL" en bronce oscuro (`#8E690D`), tipografía Arial
  Rounded MT Bold. La paleta oficial se deriva directamente de esos
  colores exactos (ver `theme/app_brand_palette.dart` — cada tono base
  cita el stop del gradiente del que proviene).

## Paleta

Definida en `theme/app_brand_palette.dart` — 9 colores × escala 50–900:

| Color | Base | Origen |
|---|---|---|
| **Primary** ("Oro 180°") | `#F0BF00` (500) | Stop terminal del gradiente dorado principal del logo. `900 = #8E690D` es el color exacto del texto "GRUPO EMPRESARIAL". |
| **Secondary** ("Plata 180°") | `#9D9D9C` (500) | Gradiente lineal "Plomo" del logo — `200`/`400`/`500` son sus stops exactos. |
| **Accent** ("Bronce 180°") | `#C9961A` (500) | Segundo gradiente dorado del logo (más cálido), reservado para énfasis secundario (chips seleccionados, resaltados) para que nunca compita con Primary como color de acción principal. |
| **Background** | `#FFFFFF` (50) | Blanco puro — el dorado resalta mejor sobre blanco que sobre un gris. |
| **Surface** | `#FBF9F4` (200) | Marfil cálido — reemplaza el gris plano `#F8F8F8` anterior; separa visualmente las tarjetas del fondo sin sensación fría. |
| **Error** | `#B00020` (500) | Mismo tono ya usado en la fase neutra — se mantiene para no cambiar el significado semántico al adoptar la paleta. |
| **Success** | `#5FA739` (500) | Verde oliva (no un verde Material puro) para armonizar con el dorado en vez de contrastar bruscamente. |
| **Warning** | `#F57C00` (500) | Naranja, deliberadamente distinto del dorado Primary para no confundirse en un badge de estado. |
| **Info** | `#2E8BDB` (500) | Azul estándar, neutro — no tiene contraparte en el logo. |

Cada color tiene su escala completa 50→900 en el archivo de tokens.

## Tipografía

Definida en `theme/app_typography.dart` — Display/Headline/Title/Body/
Label × 3 tamaños cada uno (mismo esquema que `ThemeData.textTheme`,
para que adoptarla más adelante sea un reemplazo directo).

- **Decisión de tipografía**: el logo usa "Arial Rounded MT Bold"
  (fuente propietaria, no distribuible). La pareja oficial elegida es
  **Poppins** (Display/Headline/Title — geométrica, cálida, evoca el
  carácter redondeado del logo) + **Roboto** (Body/Label — ya en uso,
  máxima legibilidad en listas densas).
- **Pendiente de aprobación explícita**: agregar Poppins requiere el
  paquete `google_fonts` o assets de fuente — una dependencia que la
  propia regla del Design System exige aprobar explícitamente antes de
  agregar (`core/ui/README.md`). Hasta entonces, todos los estilos usan
  la fuente del sistema (Roboto); los tamaños/pesos/interletrado ya son
  definitivos, solo la tipografía de Display/Headline/Title queda
  pendiente de ese swap.

## Espaciados

Sistema oficial: el existente `AppSpacing` (4/8/12/16/20/24/32/40/48/64)
se mantiene sin cambios — la auditoría visual no encontró ninguna
inconsistencia en espaciado (100% de las pantallas ya lo usan).

## Radios

Sistema oficial: el existente `AppRadius` (4/8/12/16/20/24) se mantiene
sin cambios, más un nuevo `radiusPill` (999) agregado para el estilo
oficial de chips (ver más abajo).

## Elevaciones

Sistema oficial: el existente `AppElevation` (0/1/2/4/8) se mantiene sin
cambios. Asignación oficial por componente:

- Cards: `level1`
- Bottom sheets: `level4`
- Dialogs: `level8`
- Elementos en reposo sin necesidad de separación (headers, chips):
  `level0`

## Sombras

**Decisión: no se introducen sombras personalizadas.** La auditoría
visual confirmó que ningún feature usa `BoxShadow` — toda la sombra
actual proviene de la elevación estándar de `Card`/`AppCard` (Material
3). Esto se mantiene como parte de la identidad "minimalista": sombras
sutiles, nunca decorativas.

## Animaciones (especificación, sin implementar el swap todavía)

Duraciones (`AppDurations`, sin cambios): `fast` 150ms (micro-
interacciones), `medium` 250ms (transiciones estándar: fade/scale/
slide-in), `slow` 350ms (cambios de layout más grandes).

Curvas — nuevas, en `tokens/app_curves.dart` (`AppCurves`), extraídas
de los valores ya usados por `FadeIn`/`ScaleIn`/`SlideIn` (sin cambiar
su comportamiento, solo nombrarlos):

- `standard` = `Curves.easeOut` — entradas/salidas simétricas.
- `playful` = `Curves.easeOutBack` — entradas con rebote sutil,
  reservada para elementos que piden énfasis (ya usada por `ScaleIn`).

## Iconografía

Estilo oficial: **solo Material Icons**, variante `_outlined` por
defecto (look ligero/elegante); la variante rellena (filled) se reserva
para estados activos/seleccionados. El ícono oficial de "más opciones"
se resolvió a `Icons.more_horiz` (la auditoría encontró 3 usos de
`more_horiz` contra 1 de `more_vert` sin ningún token compartido —
`AppIcons.more` ahora fija esa decisión, aunque su adopción en las 4
pantallas existentes queda para una Etapa posterior).

## Botones

- **Filled** (ya existe como `AppButton`): fondo Primary 500, texto
  blanco, radio 8, altura 48, sin elevación (plano, minimalista).
- **Tonal** *(nuevo, por construir en una Etapa posterior)*: fondo
  Primary 100, texto Primary 900, mismo radio/altura que Filled — para
  acciones de énfasis medio.
- **Outlined** *(nuevo, por construir)*: transparente, borde 1.5px
  Secondary 300, texto Primary 700 — para acciones secundarias junto a
  un CTA principal.
- **Text** *(hoy resuelto ad hoc con `TextButton` crudo en los pies de
  `login`/`register` — por formalizar)*: sin fondo/borde, texto Primary
  700, altura mínima de toque 44.

## Campos

Estilo oficial (ya construido en `AppTextField`, valores a repuntar a
la paleta de marca en la Etapa de aplicación): relleno con Surface,
radio 8, borde de foco Primary 500 (2px), borde de error Error 500.

## Cards

Estilo oficial: fondo Surface, radio 12, elevación `level1`. Se agrega
como refinamiento (Etapa posterior) un borde de 1px Secondary 200 para
dar definición sutil en fondos blancos, ya que la paleta minimalista
puede leerse plana sin él.

## Diálogos

Estilo oficial *(por construir)*: fondo Surface, radio 16, elevación
`level8`, ancho máximo 400.

## Bottom Sheets

Estilo oficial *(por construir)*: fondo Surface, esquinas superiores
radio 20, manija de arrastre 32×4 en Secondary 300, elevación `level4`.

## Chips

Estilo oficial *(por construir)*: forma píldora (`radiusPill`), fondo
Secondary 100 (no seleccionado) / Primary 100 (seleccionado), texto en
el tono 900 correspondiente, altura 32, padding horizontal
`AppSpacing.space12`.

## Tamaños de imagen

Nuevo token `tokens/app_image_size.dart` (`AppImageSize`): xs 64 / sm 96
/ md 120 / lg 160 / xl 200 / xxl 240 — formaliza la escala que la
auditoría visual encontró dispersa (96/104/120/128/152/160/168/180/220
px repetidos sin token compartido en `marketplace`/`service_detail`/
`provider_profile`/`verification`/`request_service`). **No retro-
aplicado** a esas pantallas todavía — eso es trabajo de layout, fuera
de alcance de esta Etapa.

## Qué queda para las siguientes Etapas del Sprint 2

1. Reemplazar `AppColors`/`ColorScheme` en `app_theme.dart` por
   `AppBrandPalette` (recolorea automáticamente todas las pantallas,
   sin tocarlas — ese es el punto de tener el Design System).
2. Reemplazar `ThemeData.textTheme` por `AppTypography` (mismo
   argumento).
3. Aprobar y agregar `google_fonts` (o assets) para Poppins.
4. Construir `AppButtonTonal`/`AppButtonOutlined`/`AppButtonText`,
   `AppDialog`, `AppBottomSheet`, `AppChip` como nuevos widgets `App*`.
5. Retro-aplicar `AppImageSize` en los 12 archivos que la auditoría
   señaló.
6. Extraer el widget `_StatTile` duplicado (7 features idénticos) a un
   `AppStatTile` compartido en `core/ui/widgets/`.
7. Adoptar `AppIcons` en los ~98 usos de `Icons.*` crudos detectados.
8. Decidir si el logo aparece en `SplashPage`/`AppTopBar` y, si es así,
   agregarlo al repositorio (sigue sin trackear hasta esa decisión).
