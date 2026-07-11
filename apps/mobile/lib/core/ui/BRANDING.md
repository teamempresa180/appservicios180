# Servicios 180° — Branding oficial (Sprint 2)

Este documento es la fuente de verdad de la identidad visual oficial de
**Servicios 180°**, construida a partir del análisis de
`Logo oficial grupo.svg` (raíz del repositorio — sigue **sin trackear**
a propósito, ver `PROJECT_STATUS.md` sección 7).

- **Etapa 1** definió los tokens (paleta, tipografía, curvas, tamaños de
  imagen) sin conectarlos al tema activo.
- **Etapa 2** conectó `AppBrandPalette`/`AppTypography`/`AppCurves` a
  `AppTheme.light` (`ColorScheme`/`textTheme`) y construyó los
  componentes `App*` que faltaban (`AppButton` con variantes,
  `AppChip`, `AppDialog`, `AppBottomSheet`, `AppSnackBar`, `AppAvatar`,
  `AppBadge`, `AppLoadingIndicator`, `AppStatTile`) — **sin tocar
  ningún feature**. Las pantallas heredan la identidad automáticamente.
- **Etapa 3 — Adopción global del Design System, completada.** El
  Design System ya no es solo la fuente de verdad *disponible* — es la
  fuente de verdad *en uso*: se recorrieron los ~50 features existentes
  (no solo los construidos en Sprint 2) y se reemplazó toda
  duplicación visual real por los componentes oficiales. Detalle
  completo en la sección "Adopción global (Etapa 3)" más abajo.
- **Etapa 4 — Adopción de layouts, en curso (pendiente de aprobación
  del usuario).** Mismo criterio que la Etapa 3, aplicado a
  *estructuras* en vez de a componentes: `AppPageBody`, `AppSection`,
  `AppInfoRow`, `AppActionRow`, `AppStatGrid` y `AppIconRow`
  reemplazaron la duplicación de layout real detectada en
  `presentation/pages/` y `presentation/widgets/`. Detalle completo en
  la sección "Adopción de layouts (Etapa 4)" más abajo.
- Lo que sigue pendiente (agregar Poppins, decidir sobre el logo,
  retro-aplicar `AppImageSize`) se detalla al final de este documento.

## Adopción global (Etapa 3)

Recorrida completa de `apps/mobile/lib/features/` — no solo los
features del Sprint 2. Reemplazos aplicados donde existía duplicación
**real** (mismo widget, misma estructura, repetido en más de un
archivo):

- **`AppStatTile`**: los 7 `_StatTile` privados idénticos
  (`security`, `contact_management`, `schedule`, `provider_services`,
  `availability`, `provider_dashboard`, `provider_profile`) fueron
  **eliminados** — sus 7 pantallas ahora usan `AppStatTile` (que ganó
  un parámetro `icon` opcional para cubrir la única variante entre los
  siete, la de `provider_profile`, sin perder esa diferencia).
- **`AppChip`**: los 5 usos de `ChoiceChip`/`Chip` (`notifications`,
  `reviews`, `orders`, `request_service`, `provider_profile`) fueron
  **reemplazados**.
- **`AppBadge`**: los 10 "pill" de estado duplicados (5 con nombre
  propio — `OrderStatusBadge`/`PaymentStatusBadge`/
  `ServiceStatusBadge`/`DefaultAddressBadge`, y 5 en línea —
  `credential_card`/`auth_method_card`/`contact_card`/
  `schedule_block_card`/`trust_score_card`/`verification_status`)
  fueron **reemplazados**. El color sigue calculándose en cada feature
  (el `switch` sobre el enum de dominio es lógica de negocio que
  `core/ui` no debe conocer) — solo el render del pill se delegó a
  `AppBadge`, que ganó un parámetro `color` opcional para recibir ese
  color ya resuelto. `NotificationStatusBadge` (un punto de 8×8, no un
  pill con texto) se dejó intacto — no es el mismo widget.
- **`AppAvatar`**: los 10 `CircleAvatar` que representaban una persona
  (`provider_avatar`, `profile_avatar`, `review_card`, `chat`'s
  `provider_header`, `payment_information`, `quote`'s
  `provider_resume`, `request_service`'s `provider_summary`,
  `service_detail`'s `provider_information`, `marketplace`'s
  `provider_card`, `home_header`) fueron **reemplazados** — el diseño
  de `AppAvatar` en sí se ajustó para igualar exactamente el patrón que
  esos 10 ya compartían (`Icons.person`, `context.colors.primary`/
  `onPrimary`, tamaño de ícono = radio), así que no hubo ningún cambio
  visual. `NotificationIcon`'s `CircleAvatar` se dejó intacto — no
  representa una persona, representa una categoría de notificación.
- **`AppButton`**: el `TextButton` crudo de `login`/`register` (pies de
  formulario) fue **reemplazado** por `AppButton(variant:
  AppButtonVariant.text, expand: false)`.
- **`AppLoadingIndicator`**, **`AppDialog`**, **`AppBottomSheet`**,
  **`AppSnackBar`**: sin cambios — la auditoría confirmó que ningún
  feature tenía `CircularProgressIndicator`/`showDialog`+`AlertDialog`/
  `showModalBottomSheet`/`SnackBar` manual duplicado para reemplazar.
- **`AppIcons`**: adoptado en los 16 usos de `Icons.*` que coincidían
  exactamente con un valor ya definido (`search`, `edit_outlined`,
  `delete_outline`, `info_outline`, `chevron_right`, `more_horiz`,
  `check_circle_outline` → `AppIcons.success`). El resto de los
  `Icons.*` restantes (glifos específicos de dominio sin equivalente
  curado — p. ej. `Icons.email_outlined`, `Icons.workspace_premium_
  outlined`) se dejaron como están; agregarlos todos a `AppIcons`
  desnaturalizaría el propósito de un set *curado*.

## Adopción de layouts (Etapa 4)

La adopción del Design System (Etapa 3) cubrió **componentes**
(botones, chips, badges, avatares). La Etapa 4 hace lo mismo para
**layouts**: las estructuras de página/sección repetidas en
`presentation/pages/*.dart` y `presentation/widgets/*.dart` en
prácticamente todos los features. Seis widgets nuevos en `core/ui/widgets/`
(ver la tabla de `README.md` para el detalle de cada uno):

- **`AppPageBody`**: reemplazó el esqueleto `SingleChildScrollView(child:
  Column(crossAxisAlignment: stretch, children: [FadeIn(header), gap,
  body]))` repetido casi idéntico en ~20 `*_page.dart` (`home`,
  `marketplace`, `categories`, `search`, `orders`, `notifications`,
  `reviews`, `profile`, `settings`, `security`, `trust`, `verification`,
  `schedule`, `contact_management`, `address_management`,
  `availability`, `provider_services`, `provider_dashboard`,
  `service_detail`, `provider_profile`, `quote`, `request_service`).
  **Deliberadamente no aplicado** en `ChatPage`/`PaymentsPage`: ahí el
  header solo debe aparecer en el estado "con datos" (no en
  loading/empty), un comportamiento que `AppPageBody` no reproduce
  porque siempre renderiza el header si se le pasa uno — forzarlo
  habría cambiado el comportamiento visual, así que esos dos páginas
  siguen construyendo el header a mano dentro de `_buildBody()`.
- **`AppSection`**: reemplazó el wrapper `AppCard(child: Column(children:
  [AppSectionTitle(...), ...]))` en los widgets "de resumen"/"de
  información" que lo usaban tal cual (`PaymentInformation`,
  `PaymentBreakdown`, `ServiceInformation`, `ServiceSummary`,
  `PriceBreakdown`, `ProviderServices`, `ProviderAvailability`,
  `CredentialsSection`, `AuditLogSection`, y los seis `*_statistics.dart`
  que además usan `AppStatGrid` adentro).
- **`AppInfoRow`**: reemplazó la fila `Row(mainAxisAlignment:
  spaceBetween, children: [Text(label), Text(value)])` en
  `PaymentBreakdown`, `ServiceInformation`, `ServiceSummary` y las 5
  filas de `PriceBreakdown` (incluida su clase privada `_PriceRow`,
  eliminada). **No aplicado** en `PaymentSummary` (su `_InfoRow` privado
  usa `Flexible`+`TextOverflow.ellipsis`+alineación al final para
  valores largos — un comportamiento de overflow que `AppInfoRow` no
  reproduce) ni en `ProviderServices`'s fila de nombre de servicio (usa
  `Expanded`+ellipsis de una sola línea) — forzarlos habría cambiado
  cómo se recortan los textos largos.
- **`AppActionRow`**: reemplazó el `Wrap(spacing: space8, runSpacing:
  space8, children: [...])` en los 7 `*_actions.dart` que lo usaban
  (`AddressActions`, `AuthMethodActions`, `VerificationActions`,
  `ContactActions`, `AvailabilityActions`, `ServiceActions`,
  `QuickActions`). `ProfileActions` no se tocó — es una `Column` de 3
  botones apilados, un patrón distinto, no un `Wrap`.
- **`AppStatGrid`**: reemplazó el `GridView.count` (`shrinkWrap` +
  `NeverScrollableScrollPhysics` + spacing fijo) en los 6
  `*_statistics.dart` que ya usaban `AppStatTile` en grilla
  (`SecurityStatistics`, `AvailabilityStatistics`,
  `ContactsStatistics`, `DashboardStatistics`, `ServicesStatistics`,
  `ScheduleStatistics`). `crossAxisCount`/`childAspectRatio` quedaron
  como parámetros explícitos por cada llamada para preservar la
  proporción exacta que cada pantalla ya tenía (p. ej.
  `ContactsStatistics` sigue en 3 columnas, `DashboardStatistics` sigue
  con `childAspectRatio: 2.4`). `ProviderStatistics` (un `Row` de 3
  columnas, no una grilla) y `ProfileStatistics` (una barra de progreso,
  no tiles) no encajan en esta forma y se dejaron intactos.
- **`AppIconRow`**: reemplazó la fila "ícono + texto (+ badge)" en
  `CredentialCard`, `AuditLogEntryCard`, `TrustFactorCard`,
  `VerificationStepCard`, y la fila interna de `ContactCard`/
  `AuthMethodCard`. Ganó parámetros (`iconSize`, `iconColor`, `padded`,
  `verticalPadding`, `crossAxisAlignment`) precisamente para que cada
  uno de esos 6 usos conservara su tamaño de ícono, color y padding
  original exacto — nada cambió visualmente pese a compartir ahora el
  mismo widget. `ScheduleBlockCard` no se tocó: su primera columna es
  una etiqueta de día (`SizedBox` de ancho fijo con texto), no un
  ícono, así que no encaja en la forma de `AppIconRow`.

**Revisión arquitectónica — redundancia entre layouts nuevos y
existentes**: ninguno de los seis reemplaza a un componente `App*` ya
existente; son ortogonales (`AppSection` compone `AppCard`+
`AppSectionTitle` en vez de duplicarlos, `AppStatGrid` compone
`AppStatTile`, `AppIconRow` no compone `AppBadge` pero acepta uno como
`trailing`). Tampoco hay redundancia *entre* los seis: cada uno cubre
una forma estructural distinta (raíz de página, contenedor con título,
fila de dos valores, grupo de botones, grilla, fila con ícono). No se
detectó ningún layout adicional con 5+ apariciones que faltara — la
auditoría de esta etapa cubrió `presentation/pages/` y
`presentation/widgets/` de los 30 features.

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

Las 4 variantes ya existen en un único `AppButton` (`variant:
AppButtonVariant.filled/tonal/outlined/text`, default `filled` —
retrocompatible), compartiendo forma (radio 8), altura (48), padding y
el cross-fade de carga; solo el `ButtonStyle` (de qué rol del
`ColorScheme` toma color) cambia por variante:

- **Filled** (default): `FilledButton` — fondo Primary 500, texto
  `onPrimary` (Secondary 900), sin elevación.
- **Tonal**: `FilledButton.tonal` — fondo `primaryContainer` (Primary
  100), texto `onPrimaryContainer` (Primary 900) — para acciones de
  énfasis medio.
- **Outlined**: `OutlinedButton` — transparente, borde `outline`
  (Secondary 300) — para acciones secundarias junto a un CTA principal.
- **Text**: `TextButton` — sin fondo/borde, texto `primary` — para
  acciones de baja jerarquía (p. ej. pies de formulario).

**Adoptado globalmente en la Etapa 3**: `login`/`register` ya usan
`AppButton(variant: AppButtonVariant.text)` en sus pies de formulario
— el `TextButton` crudo fue eliminado.

## Campos

Estilo oficial, ya construido en `AppTextField` — no requirió ningún
cambio de código propio: relleno Surface 200, radio 8, borde de foco
Primary 500 (2px), borde de error Error 500, todo ya vive en
`AppTheme.light.inputDecorationTheme`.

## Cards

Estilo oficial, ya construido en `AppCard`/`cardTheme` — tampoco
requirió cambios de código propio: fondo Surface 200, radio 12,
elevación `level1`, borde de 1px Secondary 200 (ya incluido en el
`cardTheme.shape.side` desde antes de esta Etapa, ahora coloreado con
la paleta oficial).

## Diálogos

Construido como `AppDialog` (`AppDialog.show(...)`): fondo Surface
(heredado del `Dialog` de Material), radio 16, elevación `level8`,
ancho máximo 400px. **No usado en ningún feature todavía** — la
auditoría de la Etapa 3 confirmó que ningún feature tenía un
`showDialog`+`AlertDialog` manual que reemplazar; el componente existe,
listo para cuando algún feature lo necesite.

## Bottom Sheets

Construido como `AppBottomSheet` (`AppBottomSheet.show(...)`): fondo
Surface, esquinas superiores radio 20, manija de arrastre (32×4,
`outline`), elevación `level4`. **No usado en ningún feature
todavía** — misma razón que `AppDialog`.

## Chips

Adoptado globalmente en la Etapa 3: forma píldora (`radiusPill`),
fondo `secondaryContainer` (no seleccionado) / `primaryContainer`
(seleccionado), texto en el `on*Container` correspondiente. Reemplaza
los 5 `ChoiceChip`/`Chip` que existían en `notifications`/`reviews`/
`orders`/`request_service`/`provider_profile`. `CategoryChip` en
`marketplace` **no** es un chip real de Material (es una tarjeta
icono+etiqueta con nombre coincidente) — no calificaba para el
reemplazo, se dejó intacto.

## SnackBar, Avatar, Badge, Loading Indicator (nuevos, no especificados originalmente en Fase 4 pero pedidos en la Etapa 2)

- **`AppSnackBar`**: 4 tonos semánticos (`info`/`success`/`warning`/
  `error`), color de fondo tomado directamente de
  `AppBrandPalette.*500`, radio 8, comportamiento flotante.
- **`AppAvatar`**: círculo con iniciales o ícono. Rediseñado en la
  Etapa 3 para igualar exactamente el patrón que 10 features ya
  compartían (`Icons.person`, `context.colors.primary`/`onPrimary`,
  tamaño de ícono = radio) — **adoptado globalmente**, cero cambios
  visuales.
- **`AppBadge`**: pastilla de estado con 5 tonos (`neutral`/`info`/
  `success`/`warning`/`error`) o un `color` ya resuelto por el caller.
  **Adoptado globalmente en la Etapa 3** por los 10 badges de estado
  que antes duplicaban el mismo `Container`+`BoxDecoration` — el
  `switch` sobre cada enum de dominio permanece en cada feature (lógica
  de negocio, no le corresponde a `core/ui`), solo el render del pill
  se delegó aquí.
- **`AppLoadingIndicator`**: el spinner de `AppLoading` extraído a su
  propio widget (sin mensaje), para poder usarse solo en contextos
  donde no aplica el `Center`+mensaje de `AppLoading`.

## Tamaños de imagen

Nuevo token `tokens/app_image_size.dart` (`AppImageSize`): xs 64 / sm 96
/ md 120 / lg 160 / xl 200 / xxl 240 — formaliza la escala que la
auditoría visual encontró dispersa (96/104/120/128/152/160/168/180/220
px repetidos sin token compartido en `marketplace`/`service_detail`/
`provider_profile`/`verification`/`request_service`). **No retro-
aplicado** a esas pantallas todavía — eso es trabajo de layout, fuera
de alcance de esta Etapa.

## Qué queda para las siguientes Etapas del Sprint 2

Completado en la Etapa 2: `ColorScheme`/`textTheme` conectados,
`AppButton` con 4 variantes, `AppChip`/`AppDialog`/`AppBottomSheet`/
`AppSnackBar`/`AppAvatar`/`AppBadge`/`AppLoadingIndicator`/
`AppStatTile` construidos, curva de "más opciones" resuelta.
Completado en la Etapa 3: adopción global de `AppStatTile`/`AppChip`/
`AppBadge`/`AppAvatar`/variantes de `AppButton`/`AppIcons` (donde
existía un equivalente exacto) en todos los features existentes (ver
"Adopción global (Etapa 3)" arriba). Pendiente para Etapas
posteriores:

1. Aprobar y agregar `google_fonts` (o assets) para Poppins
   (Display/Headline/Title siguen en Roboto hasta esa aprobación).
2. Retro-aplicar `AppImageSize` en los 12 archivos que la auditoría
   señaló (`marketplace`/`service_detail`/`provider_profile`/
   `verification`/`request_service`) — trabajo de layout, no de
   duplicación de widgets, por eso quedó fuera de la Etapa 3.
3. Adoptar `AppDialog`/`AppBottomSheet`/`AppSnackBar` donde algún
   feature futuro necesite ese patrón (ninguno lo necesita todavía).
4. Decidir si el logo aparece en `SplashPage`/`AppTopBar` y, si es así,
   agregarlo al repositorio (sigue sin trackear hasta esa decisión).
