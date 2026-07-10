# Request Service

Pantalla de solicitud de un servicio. **Completamente independiente** de
`marketplace`, `categories`, `search`, `home`, `service_detail` y
`provider_profile`: su propio repositorio, sus propios datos mock, sin
ninguna importación cruzada entre features (solo `provider_profile`
importa la **página** de este feature para poder abrirla, ver más
abajo). No tiene `Scaffold` propio — está preparada para insertarse
dentro del flujo de navegación existente más adelante, igual que el
resto de los features de esta serie. Reutiliza exclusivamente el
Design System existente. Sin identidad visual propia: sin logo, sin
colores de marca, sin tipografía corporativa, sin assets finales, sin
ilustraciones ni imágenes reales — solo Material Icons. El Sprint de
Branding sigue pendiente (Prompt 33.1).

## Arquitectura

```
request_service/
├── README.md
├── models/
│   ├── request_service_data.dart   Service + Provider + Profile + Category + Availability + Address + campos simulados
│   └── request_priority.dart       Enum de presentación (simulado, sin equivalente en el dominio)
├── repositories/
│   ├── request_service_repository.dart       Contrato: Service, Provider, Profile, Category, Availability, Address
│   └── mock_request_service_repository.dart  Implementación en memoria
├── mock/
│   └── mock_request_service_data.dart        Seed: entidades reales + fecha/hora/descripción/adjuntos/prioridad/ubicación simulados
└── presentation/
    ├── pages/
    │   └── request_service_page.dart
    └── widgets/
        ├── request_service_header.dart
        ├── service_summary.dart
        ├── provider_summary.dart
        ├── schedule_selector.dart
        ├── address_summary.dart
        ├── problem_description.dart
        ├── attachments_section.dart
        ├── priority_selector.dart
        └── continue_button.dart

test/features/request_service/ (tests del repositorio, la página, responsive, navegación)
```

- **`mock/`**: un único conjunto de entidades reales del dominio
  (`Category`, `Provider`, `Profile`, `Service`, `Availability`,
  `Address`) con IDs fijos y deterministas — este feature muestra **un
  solo servicio/proveedor fijo**, no hay lookup por ID todavía.
- **`repositories/`**: `RequestServiceRepository` (contrato) +
  `MockRequestServiceRepository`, que devuelven **únicamente entidades
  reales del dominio** — nunca `Map<String, dynamic>` ni `dynamic`.
- **`models/`**: `RequestServiceData`, la única composición de
  presentación de este feature, más `RequestPriority` (enum de
  presentación).
- **`presentation/`**: widgets puros (algunos con estado local de
  Flutter para los selectores interactivos — nunca gestión de estado a
  nivel de app); `RequestServicePage` es el único lugar que instancia
  el repositorio y arma `RequestServiceData`.

## Qué es real, derivado o simulado en `RequestServiceData`

| Campo | Origen |
|---|---|
| `service`, `provider`, `profile`, `category`, `availability`, `address` | Entidades **reales** del dominio, vía el repositorio. |
| `selectedDate`, `selectedTime` | **Simulados**: no existe todavía un caso de uso de `Schedule`/reserva de horario implementado (el módulo `Schedule` es solo dominio, sin `application`/`presentation` conectados). Editables localmente en `ScheduleSelector` vía `showDatePicker`/`showTimePicker`, sin persistencia. |
| `problemDescription` | **Simulado**: texto libre editado en `ProblemDescription` (estado local de `TextEditingController`), nunca enviado a ningún lado. |
| `attachments` | **Simulado**: `Attachment` existe como concepto de dominio pero no hay integración de cámara/galería aquí; son solo etiquetas renderizadas como placeholders neutros (mismo enfoque que `images` en `service_detail`). El tile "+" de `AttachmentsSection` es un no-op. |
| `priority` | **Simulado**: `RequestPriority` es un enum de presentación sin equivalente en el dominio. Editable localmente en `PrioritySelector`. |
| `simulatedLocationLabel` | **Simulado**: etiqueta que reemplaza un pin de mapa; no existe integración de mapas/geolocalización. |

Nada de esto se agregó a las entidades de dominio — todo vive
exclusivamente en `RequestServiceData`.

## Cómo conectar posteriormente `RequestServiceRepository`

`RequestServiceRepository` es una interfaz Dart estándar. Para conectar
datos reales:

1. Crear `ApiRequestServiceRepository implements RequestServiceRepository`
   (o `FirebaseRequestServiceRepository`) en `repositories/`,
   implementando cada método con una llamada HTTP real, mapeando la
   respuesta a las entidades de dominio correspondientes.
2. Ese es también el momento de agregar parámetros de ID (p. ej.
   `ServiceId`, `ProviderId`) a los métodos del contrato — hoy no
   existen porque la pantalla muestra un único servicio/proveedor fijo.
3. En `RequestServicePage`, cambiar `MockRequestServiceRepository()` por
   la nueva implementación — es el único punto de construcción, ningún
   widget cambia.
4. `selectedDate`/`selectedTime` pasarían a alimentar un caso de uso
   real de `Schedule`; `attachments` se conectaría al módulo
   `Attachment` con subida real; `priority` podría convertirse en un
   campo real si el dominio se amplía para soportarlo (hoy ningún
   módulo lo modela); `simulatedLocationLabel` se reemplazaría por una
   integración de mapas real.
5. En ese punto también sería el momento de introducir gestión de
   estado (para loading/error de red) y de que "Continuar" dispare un
   flujo real (probablemente creando una `Quote`/`Order`, ninguno
   implementado todavía), en vez de ser el no-op actual.

## Cambio mínimo en Provider Profile

Este prompt autorizó explícitamente un único cambio, exclusivamente
para poder abrir esta pantalla: en
`provider_profile/presentation/widgets/provider_actions.dart`, el botón
"Solicitar servicio" (antes no-op) ahora navega con `Navigator.push` a
`RequestServicePage` envuelta en un `Scaffold` simple con `AppBar` (ya
que `RequestServicePage` no construye su propio `Scaffold`) — el mismo
patrón que `provider_profile` usó para abrirse desde `service_detail`.
El botón "Chat" no fue tocado, sigue siendo un no-op. Ninguna otra
navegación fue modificada.

Como `provider_profile` muestra un único proveedor fijo simulado y
`request_service` muestra un único servicio/proveedor fijo simulado,
tocar "Solicitar servicio" en **cualquier** Provider Profile abre la
misma pantalla de solicitud simulada — intencional y documentado
también en el README de `provider_profile`.

## Qué widgets son reutilizables

- **`ServiceSummary`**, **`ProviderSummary`**, **`AddressSummary`**:
  específicos de este feature (reciben `RequestServiceData`), pero con
  una estructura interna (tarjeta + `AppSectionTitle`) consistente con
  el resto de la app.
- **`ScheduleSelector`**: genérico (recibe fecha/hora inicial),
  reutilizable en cualquier pantalla futura que necesite selección de
  fecha/hora simulada.
- **`ProblemDescription`**: envoltorio delgado sobre `AppTextField` con
  texto inicial — reutilizable donde se necesite una descripción libre.
- **`AttachmentsSection`**: genérico (recibe `List<String>`),
  reutilizable en cualquier pantalla que necesite adjuntos simulados.
- **`PrioritySelector`**: genérico (recibe prioridad inicial),
  reutilizable donde se necesite ese selector de tres niveles.
- **`ContinueButton`**: envoltorio delgado sobre `AppButton` con el
  label fijo "Continuar" — reutilizable donde se necesite exactamente
  ese CTA.

## Qué NO existe todavía (a propósito)

Orders, Backend, Firebase, HTTP, gestión de estado
(Provider/Riverpod/Bloc/Cubit/ViewModel), persistencia, creación real de
`Order`, envío real de la solicitud, lookup por ID (un único
servicio/proveedor fijo), cámara/galería real, mapas/geolocalización
real. Todo el contenido mostrado (excepto las 6 entidades de dominio
compuestas) es simulado, como se detalla arriba.

**Actualización (feature `quote`)**: el botón "Continuar" ya no es un
no-op — ahora navega (vía `Navigator.push`, no `GoRouter`) a
`QuotePage`, el único cambio permitido en este feature para ese
prompt. Como `QuotePage` también muestra una única cotización fija
simulada, esto no depende todavía del servicio/proveedor real de esta
pantalla. Ver el README de `features/quote/` para más contexto.
