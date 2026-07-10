# Quote

Pantalla de cotización de un servicio. **Completamente independiente**
de `marketplace`, `categories`, `search`, `home`, `service_detail`,
`provider_profile` y `request_service`: su propio repositorio, sus
propios datos mock, sin ninguna importación cruzada entre features
(solo `request_service` importa la **página** de este feature para
poder abrirla, ver más abajo). No tiene `Scaffold` propio — está
preparada para insertarse dentro del flujo de navegación existente más
adelante, igual que el resto de los features de esta serie. Reutiliza
exclusivamente el Design System existente. Sin identidad visual propia:
sin logo, sin colores de marca, sin tipografía corporativa, sin assets
finales, sin ilustraciones ni imágenes reales — solo Material Icons. El
Sprint de Branding sigue pendiente (Prompt 33.1).

## Arquitectura

```
quote/
├── README.md
├── models/
│   └── quote_data.dart              Quote + Service + Provider + Profile + Category + Address + desglose de costos + fecha estimada
├── repositories/
│   ├── quote_repository.dart        Contrato: Quote, Service, Provider, Profile, Category, Address
│   └── mock_quote_repository.dart   Implementación en memoria
├── mock/
│   └── mock_quote_data.dart         Seed: entidades reales + desplazamiento/descuento/impuestos/fecha estimada simulados
└── presentation/
    ├── pages/
    │   └── quote_page.dart
    └── widgets/
        ├── quote_header.dart
        ├── service_resume.dart
        ├── provider_resume.dart
        ├── schedule_resume.dart
        ├── address_resume.dart
        ├── estimated_time.dart
        ├── price_breakdown.dart
        ├── quote_notes.dart
        └── confirm_quote_button.dart

test/features/quote/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Quote`, `Category`, `Provider`, `Profile`, `Service`, `Address`) con
  IDs fijos y deterministas — este feature muestra **una sola
  cotización fija**, no hay lookup por ID todavía.
- **`repositories/`**: `QuoteRepository` (contrato) +
  `MockQuoteRepository`, que devuelven **únicamente entidades reales
  del dominio** — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `QuoteData`, la única composición de presentación de
  este feature.
- **`presentation/`**: widgets puros; `QuotePage` es el único lugar que
  instancia el repositorio y arma `QuoteData`.

## Qué es real, derivado o simulado en `QuoteData`

| Campo | Origen |
|---|---|
| `quote`, `service`, `provider`, `profile`, `category`, `address` | Entidades **reales** del dominio, vía el repositorio. |
| `subtotal` | **Real, no fabricado**: passthrough directo de `Quote.proposedPrice`, expuesto con el nombre que pidió la UI. El prompt lo listó como simulado, pero aquí se documenta que es un campo real del dominio (mismo criterio que `ProviderProfileData.experienceYears`) — no se inventó un segundo número inconsistente. |
| `travelFee` (desplazamiento), `discount` (descuento), `taxes` (impuestos) | **Simulados**: `Quote` solo modela un único `proposedPrice`, sin desglose en línea de desplazamiento/descuento/impuestos. No existe esa agregación todavía. |
| `total` | **Derivado** aquí mismo (`subtotal + travelFee - discount + taxes`) a partir de los campos anteriores. |
| `estimatedTime` | **Real, no fabricado**: passthrough directo de `Quote.estimatedDuration` (minutos), expuesto con el nombre que pidió la UI. Mismo criterio que `subtotal`. |
| `estimatedDate` | **Simulado**: `Quote` solo tiene `createdAt`/`updatedAt`, sin concepto de fecha estimada de entrega. `ScheduleResume` renderiza su fecha y hora por separado ("Fecha"/"Hora"). |
| `notes` (observaciones) | **Real, no fabricado**: passthrough directo de `Quote.notes`, expuesto con el nombre que pidió la UI ("Observaciones"). Mismo criterio que `subtotal`. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `QuoteData`.

## Cómo conectar posteriormente `QuoteRepository`

`QuoteRepository` es una interfaz Dart estándar. Para conectar datos
reales:

1. Crear `ApiQuoteRepository implements QuoteRepository` (o
   `FirebaseQuoteRepository`) en `repositories/`, implementando cada
   método con una llamada HTTP real, mapeando la respuesta a las
   entidades de dominio correspondientes.
2. Ese es también el momento de agregar un parámetro de ID (p. ej.
   `QuoteId`) a los métodos del contrato — hoy no existe porque la
   pantalla muestra una única cotización fija.
3. En `QuotePage`, cambiar `MockQuoteRepository()` por la nueva
   implementación — es el único punto de construcción, ningún widget
   cambia.
4. `travelFee`/`discount`/`taxes` pasarían a venir de un endpoint real
   de cálculo de precios; `estimatedDate` de un caso de uso real de
   `Schedule`/logística.
5. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red) y de que "Confirmar solicitud"
   dispare un flujo real (probablemente creando una `Order` a partir de
   esta `Quote`, no implementado todavía), en vez de ser el no-op
   actual.

## Cambio mínimo en Request Service

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`request_service/presentation/widgets/continue_button.dart`, el botón
"Continuar" (antes no-op) ahora navega con `Navigator.push` a
`QuotePage` envuelta en un `Scaffold` simple con `AppBar` (ya que
`QuotePage` no construye su propio `Scaffold`) — el mismo patrón que
`request_service` usó para abrirse desde `provider_profile`. Ninguna
otra navegación fue modificada.

Como `request_service` muestra un único servicio/proveedor fijo
simulado y `quote` muestra una única cotización fija simulada, tocar
"Continuar" en **cualquier** Request Service abre la misma pantalla de
cotización simulada — intencional y documentado también en el README
de `request_service`.

## Qué widgets son reutilizables

- **`ServiceResume`**, **`ProviderResume`**, **`AddressResume`**,
  **`ScheduleResume`**, **`EstimatedTime`**, **`QuoteNotes`**:
  específicos de este feature (reciben `QuoteData`), pero con una
  estructura interna (tarjeta + `AppSectionTitle`) consistente con el
  resto de la app.
- **`PriceBreakdown`**: estructura de desglose de precios reutilizable
  en cualquier pantalla futura que necesite mostrar subtotal/cargos/
  descuentos/impuestos/total.
- **`ConfirmQuoteButton`**: envoltorio delgado sobre `AppButton` con el
  label fijo "Confirmar solicitud" — reutilizable donde se necesite
  exactamente ese CTA.

## Qué NO existe todavía (a propósito)

Backend, HTTP, Firebase, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, pagos, chat,
notificaciones, creación real de `Order` a partir de esta `Quote`,
lookup por ID (una única cotización fija). Todo el contenido mostrado
(excepto las 6 entidades de dominio compuestas y los 3 campos reales
expuestos con otro nombre) es simulado o derivado, como se detalla
arriba.

**Actualización (feature `orders`)**: el botón "Confirmar solicitud" ya
no es un no-op — ahora navega (vía `Navigator.push`, no `GoRouter`) a
`OrdersPage`, el único cambio permitido en este feature para ese
prompt. Sigue sin crear una `Order` real a partir de esta `Quote` — ver
el README de `features/orders/` para más contexto.
