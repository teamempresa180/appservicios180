# Trust

Pantalla de confianza/reputación. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile`, `request_service`, `quote`, `orders`, `payments`,
`chat`, `notifications`, `reviews`, `profile`, `settings`,
`address_management`, `provider_dashboard`, `provider_services`,
`availability` y `verification`: su propio repositorio, sus propios
datos mock, sin ninguna importación cruzada entre features (solo
`provider_profile` importa la **página** de este feature para poder
abrirla, ver más abajo). No tiene `Scaffold` propio. Reutiliza
exclusivamente el Design System existente. Sin identidad visual
propia — solo Material Icons.

## Arquitectura

```
trust/
├── README.md
├── mock/
│   └── mock_trust_data.dart          Seed: Identity + Trust reales + factores simulados
├── models/
│   └── trust_display.dart             Identity + Trust + factores simulados
├── repositories/
│   ├── trust_repository.dart          Contrato: Identity, Trust
│   └── mock_trust_repository.dart     Implementación en memoria
└── presentation/
    ├── pages/
    │   └── trust_page.dart
    └── widgets/
        ├── trust_header.dart
        ├── trust_score_card.dart
        ├── trust_factors.dart
        ├── trust_factor_card.dart
        ├── trust_loading.dart
        └── trust_empty_state.dart

test/features/trust/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: una única `Identity`/`Trust` reales y deterministas,
  prefijadas `trust-` — este feature muestra el registro de confianza
  de **una sola cuenta fija**, no hay lookup por ID ni autenticación
  real todavía.
- **`repositories/`**: `TrustRepository` (contrato) +
  `MockTrustRepository`, que devuelven **únicamente entidades reales
  del dominio** (`Identity`, `Trust`) — nunca `Map<String, dynamic>`,
  `dynamic` ni JSON.
- **`models/`**: `TrustDisplay`, la única composición de presentación
  de este feature.
- **`presentation/`**: widgets puros; `TrustPage` es el único lugar
  que instancia el repositorio y arma `TrustDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `identity`, `trust` | Entidades **reales** del dominio (`identity/`, `trust/`), servidas por el repositorio **mock** (`MockTrustRepository`, datos fijos en memoria). |
| Puntaje, nivel, estado, última actualización | **Reales, no fabricados**: passthrough directo de `Trust.score`/`Trust.level`/`Trust.status`/`Trust.updatedAt`, expuestos como getters (`scoreValue`, `levelText`, `statusText`, `lastUpdated`) en `TrustDisplay`. |
| `factors` | **Totalmente simulados** — no existe ningún concepto de dominio que modele un desglose de "por qué" el puntaje es el que es. Ver la nota importante más abajo. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `TrustDisplay`.

### Nota importante: por qué `factors` es simulado y el resto no

A diferencia de `Verification` (donde el prompt restringió
explícitamente el repositorio a `Identity`/`Profile`, dejando el
módulo de dominio real `Verification` sin usar), este prompt **no**
impuso ninguna restricción de entidades — por eso este feature usa
directamente el módulo de dominio real `Trust` (`score`, `level`,
`status`, `updatedAt`) en vez de simular una segunda vez algo que ya
existe, siguiendo el mismo patrón "derivado, no simulado" usado en la
mayoría de los features de esta serie (`OrderDisplay.scheduledDate`,
`AvailabilityDisplay.activeDaysCount`, etc.).

Lo único que queda simulado es `factors`: la propia entidad `Trust`
está documentada en el dominio (`trust/entities/trust.dart`) como
*"Pure data holder — no scoring logic ... no calculation logic"* — es
decir, el dominio deliberadamente no modela **por qué** un puntaje es
el que es, solo el resultado final. `TrustFactors`/`mockTrustFactors`
cubren esa ausencia con una lista de ejemplo, documentada aquí y en
`TrustDisplay` como simulada en el sentido más estricto.

**Sin colores ni iconos en el modelo**: `TrustDisplay` no almacena
ningún `Color` ni `IconData`. `TrustScoreCard` resuelve su color desde
`context.colors.*` — nunca un literal suelto, siguiendo la misma regla
ya aplicada en `OrderStatusBadge`/`VerificationStatusCard`.

## Estados visuales

`TrustPage` acepta un parámetro fijo `state` (`TrustViewState`:
`loading`/`empty`/`information`) — mismo patrón que el resto de los
features desde `search`. Por defecto renderiza `information` con el
estado mock (`high`/`active`).

## Cómo conectar posteriormente

### Con Provider Profile

`TrustDisplay.identity`/`trust` hoy son un mock independiente del que
usa `provider_profile`. Cuando exista sesión real, ambos features
resolverían la misma `Identity` autenticada, y `provider_profile`
podría mostrar un indicador real de nivel de confianza derivado de
este mismo estado.

### Con Backend

`TrustRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiTrustRepository implements TrustRepository` en
   `repositories/`, implementando cada método con una llamada HTTP
   real.
2. En `TrustPage`, cambiar `MockTrustRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
3. Ese también sería el momento de introducir el motor de cálculo real
   detrás de `Trust.score`/`Trust.level` (hoy fijos en el mock) y, si
   se decide modelar un desglose real de factores, extender el
   dominio en vez de seguir usando `mockTrustFactors`.

## Cambio mínimo en Provider Profile

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_profile/presentation/widgets/provider_actions.dart`, se
agregó un cuarto botón "Confianza" (junto a "Solicitar
servicio"/"Chat"/"Verificación") que navega con `Navigator.push` a
`TrustPage` envuelta en un `Scaffold` simple con `AppBar` (ya que
`TrustPage` no construye su propio `Scaffold`), siguiendo exactamente
el mismo patrón usado para abrir `VerificationPage`. Ninguna otra
navegación fue modificada.

## Qué widgets son reutilizables

- **`TrustFactorCard`**: genérico (recibe solo `label`), reutilizable
  en cualquier pantalla futura que necesite el mismo formato de fila
  ícono+texto, mismo espíritu que `VerificationStepCard`.
- **`TrustEmptyState`**, **`TrustLoading`**: envoltorios delgados sobre
  `AppEmptyState`/`AppLoading` — reutilizables donde se necesiten esos
  estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado (Provider/Riverpod/Bloc/Cubit/
ViewModel), persistencia, autenticación real, motor de cálculo real de
puntaje/nivel, lookup por ID. Todo el contenido mostrado (excepto las
2 entidades de dominio compuestas y sus campos reales) es simulado,
como se detalla arriba.
