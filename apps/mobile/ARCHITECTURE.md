# Arquitectura Frontend — Servicios 180° (Flutter)

> Sprint 2, Etapa 6 — Preparación para Backend. Este documento describe
> el patrón de capas estandarizado en `apps/mobile/lib/features/`, listo
> para que Sprint 3 reemplace los datos simulados por un backend real
> sin reestructurar nada. Léelo junto con `PROJECT_STATUS.md` (estado
> general del proyecto) y `core/ui/README.md`/`BRANDING.md` (Design
> System y layouts).

## Filosofía

Cada feature de datos (23 de los 30 features — los 7 restantes son
pantallas de navegación/auth puras sin datos: `app_shell`, `home`,
`login`, `onboarding`, `register`, `select_role`, `splash`) sigue el
mismo flujo de capas:

```
Repository (contrato)          — qué entidades de dominio necesita la pantalla
      ↑ implementa
MockRepository                 — hoy: datos fijos en memoria
      │
      ▼
Mapper.toDisplay(...)          — compone el Display a partir del repositorio
      │                          + los campos aún simulados (si los hay)
      ▼
Display                        — modelo de presentación, con getters derivados
      │
      ▼
Page._buildData() → Widgets    — la página arma el Display UNA vez por build
                                  y lo pasa a header + body
```

## Las cinco carpetas de cada feature de datos

```
features/<feature>/
  models/          <Feature>Display — composición tipada, getters derivados
  dtos/            <Feature>Dto — forma "de cable" sin getters derivados
                    (preparado para cuando el backend responda JSON real)
  repositories/     <Feature>Repository (contrato) + Mock<Feature>Repository
  datasources/       <Feature>LocalDataSource / <Feature>RemoteDataSource
                     (solo interfaces — ver más abajo)
  mappers/           <Feature>Mapper.toDisplay(...) — la única conversión
                      Domain → Display, sin lógica duplicada en la página
  mock/              datos semilla para MockRepository
  presentation/
    pages/           <Feature>Page — llama al Mapper una sola vez por build()
    widgets/         widgets "tontos" que solo reciben el Display
```

## `datasources/` — solo interfaces, sin implementación

Cada uno de los 23 features de datos tiene `<Feature>LocalDataSource` y
`<Feature>RemoteDataSource`, con las mismas firmas que el `Repository`
del feature (`RemoteDataSource` envuelve cada retorno en `Future<T>`).
Documentan el punto exacto donde encajaría una implementación real
(`ApiXRepository` componiendo un `XRemoteDataSource` real +
`XLocalDataSource` como caché) sin necesidad de tocar el `Repository`
ni ningún widget — **ninguna de estas interfaces tiene implementación
todavía**, es intencional (ver `PROJECT_STATUS.md`).

## `mappers/` + `dtos/` — patrón completo, aplicado a 6 features de referencia

El patrón `Mapper`/`Dto` está **completamente implementado y verificado**
(mapper creado, wireado en la página, `flutter test` en verde) en:

- `security` (`SecurityMapper`, `SecurityDto`)
- `settings` (`SettingsMapper`, `SettingsDto`)
- `trust` (`TrustMapper`, `TrustDto`)
- `verification` (`VerificationMapper`, `VerificationDto`)
- `profile` (`ProfileMapper`, `ProfileDto`)
- `provider_dashboard` (`ProviderDashboardMapper`, `ProviderDashboardDto`)

Estos seis se eligieron porque sus páginas llamaban a `_buildData()`
**dos veces por build** (una para el header, otra para el body) —
wirear el `Mapper` de paso corrigió ese bug de performance real: ahora
`build()` calcula `data` una sola vez y se la pasa a `header` y a
`_buildBody(data)`.

Los otros 17 features de datos ya tienen `datasources/` (interfaces),
pero **todavía no tienen `mappers/`/`dtos/` generados** — sí tienen
`_buildData()`/`_build*()` en su página con exactamente la misma forma
que los seis de referencia, así que extraerlos sigue el mismo patrón,
archivo por archivo, sin decisiones de diseño nuevas. Queda como
trabajo mecánico de continuación, no arquitectónico.

## Qué NO se tocó (deliberado)

- **18 de 23 páginas siguen importando `mock/mock_*.dart` directamente**
  para los campos simulados de su `Display` (p. ej.
  `mockDashboardTodayEarnings`), además de pasar por el repositorio.
  En los 6 features de referencia, este acoplamiento se movió un
  nivel hacia adentro (el `Mapper.toDisplay()` recibe esos valores
  como parámetros con nombre en vez de que el `Display` los reciba
  directo) — reducir esto en los 17 restantes es la misma extracción
  mecánica mencionada arriba.
- **Ningún `Repository` cambió de forma.** El contrato público
  (`getX()`/`getXFor()`) es exactamente el mismo — los `DataSource`
  son un nivel adicional *debajo* del repositorio, no un reemplazo.
- **Ninguna dependencia nueva.** No se agregó `intl`,
  `flutter_localizations`, `http`, `dio`, `firebase_*` ni paquetes de
  gestión de estado — sigue sin haber ninguno, tal como pide esta
  etapa.

## Internacionalización (i18n) — preparación sin traducir

El proyecto **no tiene** `intl`/`flutter_localizations` instalados
todavía — agregarlos está fuera de alcance de esta etapa ("no agregar
dependencias"). Lo que sí queda documentado: todos los strings de UI
están en español, hardcodeados directamente en cada widget (sin
`Text.rich` con lógica de formato numérico/fecha embebida más allá de
los helpers `_formatDate`/`_formatTime` ya existentes por feature). El
primer paso real de i18n, cuando se decida abordarlo, sería agregar
`flutter_localizations` + `intl` al `pubspec.yaml` y extraer estos
strings a archivos `.arb` — no se hizo aquí porque requiere una
dependencia nueva.

## Accesibilidad — auditado

- Los 7 `IconButton` de toda la app ya tienen `tooltip` (verificado por
  grep exhaustivo) — no se encontró ninguno sin etiqueta accesible.
- Los widgets interactivos (`AppButton`, `AppCard.onTap`, `AppChip`)
  usan `Material`/`InkWell`/`FilledButton` etc., que ya proveen
  semántica de "botón" y foco de teclado por defecto — no se
  encontraron widgets custom reimplementando gestos sin pasar por
  Material.
- No se encontraron oportunidades adicionales de `Semantics` explícito
  que no estuviera ya cubierto por los widgets Material subyacentes.

## Performance — auditado

- `flutter analyze` (con `flutter_lints`, que incluye
  `prefer_const_constructors`) está limpio en todo el proyecto — no
  hay `const` faltante detectable estáticamente.
- Las listas son estáticas (datos mock fijos, sin reordenamiento en
  tiempo de ejecución) — no se encontró ningún caso donde una `Key`
  explícita fuera necesaria.
- El hallazgo de performance real de esta etapa (doble composición de
  `Display` por build en 6 páginas) ya se corrigió como parte del
  wireo de `mappers/` — ver arriba.
