# Verification

Pantalla de verificación de identidad. **Completamente independiente**
de `marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile`, `request_service`, `quote`, `orders`, `payments`,
`chat`, `notifications`, `reviews`, `profile`, `settings`,
`address_management`, `provider_dashboard`, `provider_services` y
`availability`: su propio repositorio, sus propios datos mock, sin
ninguna importación cruzada entre features (solo `provider_profile`
importa la **página** de este feature para poder abrirla, ver más
abajo). No tiene `Scaffold` propio. Reutiliza exclusivamente el Design
System existente. Sin identidad visual propia — solo Material Icons.

## Arquitectura

```
verification/
├── README.md
├── mock/
│   └── mock_verification_data.dart          Seed: Identity + Profile reales + estado/pasos simulados
├── models/
│   ├── verification_display.dart             Identity + Profile + campos simulados
│   └── verification_status_display.dart      Enum de presentación (simulado)
├── repositories/
│   ├── verification_repository.dart          Contrato: Identity, Profile
│   └── mock_verification_repository.dart     Implementación en memoria
└── presentation/
    ├── pages/
    │   └── verification_page.dart
    └── widgets/
        ├── verification_header.dart
        ├── verification_status.dart
        ├── verification_steps.dart
        ├── verification_step_card.dart
        ├── document_preview.dart
        ├── selfie_preview.dart
        ├── verification_actions.dart
        ├── verification_loading.dart
        ├── verification_empty_state.dart
        └── submit_verification_button.dart

test/features/verification/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: una única `Identity`/`Profile` reales y deterministas,
  prefijadas `verification-` — este feature muestra el estado de
  verificación de **una sola cuenta fija**, no hay lookup por ID ni
  autenticación real todavía.
- **`repositories/`**: `VerificationRepository` (contrato) +
  `MockVerificationRepository`, que devuelven **únicamente entidades
  reales del dominio** (`Identity`, `Profile`) — nunca
  `Map<String, dynamic>`, `dynamic` ni JSON.
- **`models/`**: `VerificationDisplay`, la única composición de
  presentación de este feature.
- **`presentation/`**: widgets puros; `VerificationPage` es el único
  lugar que instancia el repositorio y arma `VerificationDisplay`.

## Qué pertenece al dominio, qué es mock y qué es simulado

| Campo | Origen |
|---|---|
| `identity`, `profile` | Entidades **reales** del dominio (`identity/`, `profiles/`), servidas por el repositorio **mock** (`MockVerificationRepository`, datos fijos en memoria). |
| Nombre completo, tipo de documento | **Reales, no fabricados**: passthrough directo de `Identity.fullName`/`Identity.documentType`, mostrados en `DocumentPreview`. |
| `verificationStatus`, `completedSteps`, `pendingSteps`, `rejectedReason`, `estimatedReviewTime` | **Totalmente simulados** — exactamente como el prompt los listó. Ver la nota importante más abajo sobre por qué no se derivan de una entidad real, a diferencia del resto de features de esta serie. |
| Selfie (`SelfiePreview`) | **Totalmente simulada**: no existe integración de cámara, y ningún campo de dominio modela una selfie. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `VerificationDisplay`.

### Nota importante: el módulo de dominio `Verification` existe, pero no se usa aquí

A diferencia de casi todos los features anteriores de esta serie
(donde un campo "simulado" que ya tenía un equivalente real en el
dominio se exponía como getter derivado — p. ej.
`OrderDisplay.scheduledDate`, `ProviderServiceDisplay.isPublished`,
`AvailabilityDisplay.activeDaysCount`), aquí **no** se hizo eso.

El dominio ya tiene un módulo `Verification` completo
(`verification/entities/verification.dart`) con un enum
`VerificationStatus` (`pending`/`approved`/`rejected`/`expired`) que
modela exactamente el concepto de `verificationStatus`. Sin embargo,
este prompt restringió explícitamente el repositorio de este feature a
"Identity, Profile" únicamente — sin mencionar `Verification` en la
lista permitida. Por eso `VerificationRepository` **no** devuelve
`Verification`, y `verificationStatus`/`completedSteps`/`pendingSteps`/
`rejectedReason`/`estimatedReviewTime` siguen siendo simulados en el
sentido más estricto, tal como el prompt los definió.

Esto es intencional y documentado, no un descuido: `VerificationDisplay`
explica esta misma nota en el doc de su propia clase. Ver "Cómo se
conectará con Backend" más abajo para cómo se resolvería esto en el
futuro.

**Sin colores ni iconos en el modelo**: `VerificationDisplay` no
almacena ningún `Color` ni `IconData`. `VerificationStatusCard`
resuelve su color desde `context.colors.*` — nunca un literal suelto,
siguiendo la misma regla ya aplicada en
`OrderStatusBadge`/`ServiceStatusBadge`.

## Estados visuales

`VerificationPage` acepta un parámetro fijo `state`
(`VerificationViewState`: `loading`/`empty`/`information`) — mismo
patrón que el resto de los features desde `search`. Por defecto
renderiza `information` con el estado mock (`pending`).

## Cómo conectar posteriormente

### Con Login

No existe todavía ningún flujo de registro/login que dispare esta
pantalla — `login`/`register` no importan `verification`. Cuando
exista autenticación real, el flujo natural sería: registro → subir
documento/selfie aquí → esperar aprobación → habilitar funciones que
requieran identidad verificada.

### Con Provider Profile

`VerificationDisplay.identity`/`profile` hoy son un mock independiente
del que usa `provider_profile`. Cuando exista sesión real, ambos
features resolverían la misma `Identity`/`Profile` autenticada, y
`provider_profile` podría mostrar un indicador real de "proveedor
verificado" derivado de este mismo estado.

### Con Backend

`VerificationRepository` es una interfaz Dart estándar. Para conectar
datos reales:

1. Crear `ApiVerificationRepository implements VerificationRepository`
   en `repositories/`, implementando cada método con una llamada HTTP
   real.
2. Este es también el momento natural para **extender el contrato** a
   `getVerifications() → List<Verification>` (el módulo de dominio real
   descrito arriba), reemplazando `verificationStatus`/
   `completedSteps`/`pendingSteps`/`rejectedReason` por datos derivados
   de esos registros reales — el mismo patrón "derivado, no simulado"
   usado en el resto de la app, ahora sí aplicable porque el prompt que
   restringía las entidades ya no aplicaría.
3. En `VerificationPage`, cambiar `MockVerificationRepository()` por la
   nueva implementación — es el único punto de construcción, ningún
   widget cambia.
4. Ese también sería el momento de introducir gestión de estado (para
   loading/error de red) y de que `VerificationActions`/
   `SubmitVerificationButton` disparen una subida real (cámara/galería)
   en vez de ser no-ops.

### Con IA para validación documental

No existe ninguna integración de IA/OCR que valide automáticamente un
documento o compare una selfie contra la foto del documento — eso
sería, en el futuro, el motor detrás de la transición automática de
`verificationStatus` de `pending` a `approved`/`rejected` (hoy fijo en
`pending` en el mock). `rejectedReason` es el campo pensado para
mostrar el motivo que esa IA (o un revisor humano) devolvería.

## Cambio mínimo en Provider Profile

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_profile/presentation/widgets/provider_actions.dart`, se
agregó un tercer botón "Verificación" (antes solo "Solicitar
servicio"/"Chat") que navega con `Navigator.push` a `VerificationPage`
envuelta en un `Scaffold` simple con `AppBar` (ya que `VerificationPage`
no construye su propio `Scaffold`). Ninguna otra navegación fue
modificada.

## Qué widgets son reutilizables

- **`VerificationStepCard`**: genérico (recibe `label`/`isCompleted`),
  reutilizable en cualquier pantalla futura que necesite una lista de
  pasos con el mismo formato.
- **`DocumentPreview`**, **`SelfiePreview`**: placeholders neutros,
  mismo patrón que `ServiceGallery` en `service_detail` — reutilizables
  mientras no exista branding/imágenes reales.
- **`VerificationActions`**: tres botones fijos — reutilizable donde se
  necesite exactamente ese CTA triple.
- **`SubmitVerificationButton`**: envoltorio delgado sobre `AppButton`
  con el label fijo "Enviar verificación".
- **`VerificationEmptyState`**, **`VerificationLoading`**: envoltorios
  delgados sobre `AppEmptyState`/`AppLoading` — reutilizables donde se
  necesiten esos estados con esta copy.

## Qué NO existe todavía (a propósito)

Backend, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, autenticación
real, cámara/galería real, validación documental por IA, uso del
módulo de dominio `Verification` (ver la nota importante arriba),
lookup por ID. Los botones "Tomar foto"/"Subir documento"/
"Reintentar"/"Enviar verificación" no hacen nada más que existir
visualmente. Todo el contenido mostrado (excepto las 2 entidades de
dominio compuestas) es simulado, como se detalla arriba.
