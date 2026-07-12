# Sprint 3 — Documento de Preparación (Transición Mock → Backend)

> Generado al cierre del Sprint 2 (Prompt 57). Léelo junto con
> `PROJECT_STATUS.md` (estado sesión a sesión), `apps/mobile/ARCHITECTURE.md`
> (patrón de capas frontend) y `apps/mobile/lib/core/ui/README.md`/
> `BRANDING.md` (Design System). Este documento **no se ha commiteado
> todavía** — queda pendiente de tu aprobación explícita, igual que su
> contenido no implica ningún cambio de código.

> **Actualización (Prompt 59)**: la sección 8 de este documento
> señalaba la ausencia de una decisión de persistencia como riesgo
> medio. **Ya está resuelta**: el usuario confirmó **Prisma +
> PostgreSQL** como estrategia oficial de persistencia del proyecto —
> Domain/Application permanecen independientes de Prisma, todo el
> código específico vive en `infrastructure/` de cada módulo. Primera
> implementación real: bounded context Identity & Access
> (`identity`/`authentication`/`credentials`) — **Application e
> Infrastructure completos, consolidados en el commit `b948fad`**
> (Prompt 60, Fase 1).
>
> **Actualización (Prompt 60)**: siguiendo el orden de la sección 5
> (Identity & Access → Profiles → Trust & Compliance → ...), se
> implementó **`Profile`** (dentro del bounded context Profiles &
> Contact) hasta Infrastructure, mismo patrón exacto que Identity &
> Access. **Consolidado en el commit `2626a4b`** (Prompt 61, Fase 1).
>
> **Actualización (Prompt 61)**: se completaron **`Contact`** y
> **`Address`** hasta Infrastructure, mismo patrón exacto. **Con esto,
> el bounded context Profiles & Contact (Profile/Contact/Address)
> queda 100% completo hasta Infrastructure.** Consolidado en el commit
> `8ece5a6` (Prompt 62, Fase 1).
>
> **Actualización (Prompt 62)**: se completaron **`Verification`**,
> **`Trust`** y **`Audit`** hasta Infrastructure. **Con esto, el
> bounded context Trust & Compliance queda 100% completo hasta
> Infrastructure.** Dos invariantes reales del dominio, respetadas sin
> inventar comportamiento adicional: `Trust` es 1:1 con `Identity`
> (reforzado con `@unique` en `schema.prisma` además de
> `BusinessRuleException` en el Use Case); `Audit` es inmutable (solo
> Create/Get/List/Search). Consolidado en el commit `0242c97` (Prompt
> 63, Fase 1).
>
> **Actualización (Prompt 63)**: se completaron **`Category`** y
> **`Service`** hasta Infrastructure. **Hallazgo estructural de la
> auditoría**: no existe ningún módulo de dominio `Marketplace` ni
> `Search` en el backend (confirmado por grep en las 23 carpetas de
> módulo) — "Marketplace" se satisface con Category+Service(+Provider
> futuro), "Search" con el método `search()` por-repositorio ya
> establecido en todos los módulos anteriores; no se creó ningún
> `MarketplaceModule`/`SearchModule`. `Provider` quedó fuera de
> alcance de ese prompt — sin Infrastructure todavía, por lo que
> `CreateServiceUseCase` verificaba `Category` pero no `Provider`.
> Consolidado en el commit `1c137b3` (Prompt 64, Fase 1).
>
> **Actualización (Prompt 64)**: se completaron **`Provider`**,
> **`Availability`** y **`Schedule`** hasta Infrastructure. **Con
> esto, el bounded context Marketplace
> (Category/Service/Provider/Availability/Schedule) queda 100%
> completo hasta Infrastructure.** `Provider` tiene el mismo
> invariante 1:1 con `Identity` que `Trust`
> (`ProviderModel.identityId` es `@unique`), y referencia real a
> `Profile`. **La dependencia pendiente de Prompt 63 quedó resuelta**:
> `CreateServiceUseCase` ahora también verifica `Provider`, y
> `ServiceModel.providerId` es un `@relation` real a `ProviderModel`
> en `schema.prisma` — cambio mínimo autorizado explícitamente por el
> prompt, documentado en el schema y en el propio Use Case. Sin
> Controllers REST conectados todavía. Consolidado en un único commit
> durante la Fase 1 del Prompt 65 — ver `PROJECT_STATUS.md`, sección
> "Prompt 64", para el detalle completo.
>
> **Actualización (Prompt 65)**: se completaron **`Order`** y
> **`Quote`** hasta Infrastructure — bounded context Fulfillment.
> **Hallazgo de la auditoría (Fase 2)**: `QuoteRepository.findByOrderId`
> devuelve `Quote[]` (no un único `Quote`), confirmado desde el propio
> código de dominio — **no existe el invariante "una Order solo acepta
> una Quote"** que mencionaban notas de sesiones previas; una misma
> `Order` puede recibir múltiples `Quote` de distintos Providers, sin
> que eso se haya inventado ni añadido artificialmente. Tampoco existe
> comando/caso de uso de Delete en ninguno de los dos módulos (no
> estaba en el skeleton original), mismo criterio que `Verification`/
> `Trust`. `CreateOrderUseCase` verifica `Identity`, `Provider` y
> `Service` (los tres ya tenían Infrastructure); `CreateQuoteUseCase`
> verifica `Order` y `Provider` (ambos con Infrastructure real para
> cuando se implementó este prompt, sin ninguna dependencia diferida).
> `GetOrderUseCase`/`GetQuoteUseCase` devuelven `null` en vez de lanzar
> `NotFoundException` — respeta la firma `Promise<Dto | null>` ya
> declarada en el skeleton original de ambos casos de uso, distinta del
> patrón usado en Provider/Service. Sin Controllers REST para
> List/Search todavía (mismo criterio que Provider/Service: los casos
> de uso existen y están cableados en el módulo de Nest, pero no
> expuestos por el Controller). Trabajo completo hasta Infrastructure.
> Consolidado en un único commit durante la Fase 1 del Prompt 66 — ver
> `PROJECT_STATUS.md`, sección "Prompt 65", para el detalle completo.
>
> **Actualización (Prompt 66)**: se completaron **`Payment`** y
> **`Review`** hasta Infrastructure — bounded context Payments &
> Reputation. **Hallazgo de la auditoría (Fase 2)**:
> `PaymentRepository.findByQuoteId` y `ReviewRepository.findByOrderId`
> devuelven arrays, no un registro único — **no existe ningún
> invariante 1:1 Quote↔Payment ni Order↔Review**, confirmado desde el
> dominio real. `Payment` tiene comando Cancel, sin Delete (mismo
> criterio que `Order`); **`Review` sí tiene comando Delete** — estaba
> en su skeleton original, a diferencia de `Order`/`Quote`.
> `ReviewRating.of()` no valida escala por diseño (según su propio
> comentario de dominio), así que `ReviewValidator` tampoco impone un
> rango 1-5 inventado. `CreatePaymentUseCase` verifica `Quote`,
> `Order`, `Identity` (pagador) y `Provider` (receptor); 
> `CreateReviewUseCase` verifica `Order`, `Provider` e `Identity`
> (reviewer) — los siete ya tenían Infrastructure real, sin ninguna
> dependencia diferida. `GetPaymentUseCase`/`GetReviewUseCase`
> devuelven `null` en vez de lanzar `NotFoundException`, mismo patrón
> que Order/Quote. Trabajo completo hasta Infrastructure. Consolidado
> en un único commit durante la Fase 1 del Prompt 67 — ver
> `PROJECT_STATUS.md`, sección "Prompt 66", para el detalle completo.
>
> **Actualización (Prompt 67)**: se completaron **`Chat`**,
> **`Message`**, **`Notification`** y **`Attachment`** hasta
> Infrastructure — bounded context Communication. **Hallazgo de la
> auditoría (Fase 2)**: ninguno de los 4 módulos tiene comando
> Update en su skeleton — sólo Create + transición de estado
> (`CloseChatCommand`/ninguno/`MarkNotificationAsReadCommand`/ninguno)
> + Delete donde el skeleton realmente lo ofrecía (`Message`,
> `Notification`, `Attachment` — **no** `Chat`). `CreateChatUseCase`
> verifica `Order`/`Identity` (cliente)/`Provider`;
> `SendMessageUseCase` verifica `Chat`/`Identity` (sender) — `Chat`
> implementado antes en este mismo prompt, respetando la dependencia
> real; `CreateNotificationUseCase` verifica sólo `Identity`;
> `CreateAttachmentUseCase` verifica `Message` — implementado antes
> en este mismo prompt. Ninguna dependencia quedó diferida.
> `GetChatUseCase`/`GetMessageUseCase`/`GetNotificationUseCase`/
> `GetAttachmentUseCase` devuelven `null` en vez de lanzar
> `NotFoundException`, mismo patrón que Order/Quote/Payment/Review.
> **Con este prompt, los 22 bounded contexts de negocio del backend
> quedan 100% completos hasta Infrastructure** — no queda ningún
> módulo reservado. Trabajo completo hasta Infrastructure. Consolidado
> en un único commit durante la Fase 1 del Prompt 68 — ver
> `PROJECT_STATUS.md`, sección "Prompt 67", para el detalle completo.
> **Con este commit, Sprint 3 queda oficialmente cerrado.** Sprint 4
> (HTTP Layer / Presentation real) comienza en el Prompt 68 — ver
> `PROJECT_STATUS.md`, sección "Prompt 68", para su roadmap y avance;
> este documento (`SPRINT3_PREPARATION.md`) deja de recibir
> actualizaciones de progreso a partir de aquí, se conserva como
> registro histórico de Sprint 3.

## 1. Estado real del proyecto

- **Sprint 1** (Prompts 19–51): los 23 módulos de dominio (Domain
  layer, 100% completo desde antes de Sprint 1) tienen representación
  visual completa — 21 como feature dedicado, 2 (`Credentials`,
  `Audit`) y 1 (`Attachment`) como extensiones deliberadas de features
  existentes.
- **Sprint 2** (Prompts 52–56, Etapas 1–6): identidad visual oficial
  ("Servicios 180°") definida y aplicada globalmente; Design System
  completo y de adopción obligatoria (`AppButton`, `AppCard`,
  `AppStatTile`, `AppChip`, `AppBadge`, `AppAvatar`, `AppDialog`,
  `AppBottomSheet`, `AppSnackBar`, etc.); layouts reutilizables
  (`AppPageBody`, `AppSection`, `AppInfoRow`, `AppActionRow`,
  `AppStatGrid`, `AppIconRow`) adoptados en ~50 archivos; UX pulida
  (listas con entrada escalonada, cross-fade de navegación, feedback
  consistente, desktop UX); infraestructura de datos preparada
  (`datasources/` en los 23 features, `mappers/`+`dtos/` completos y
  wireados en 6 features de referencia).
- **748 tests pasando**, `flutter analyze` limpio, `flutter build
  windows` exitoso — verificado en cada prompt desde el Prompt 19.
- **Backend (`apps/backend`)**: Domain (113 tests, 51 suites) +
  Application (esqueleto, `execute()` lanza `"Not implemented yet"`) +
  Presentation (22 controllers REST, Swagger en `/docs`) completos.
  **Infrastructure vacía** — sin base de datos, sin persistencia, sin
  autenticación real. Esto es exactamente donde empieza Sprint 3.

## 2. Qué está terminado

| Área | Estado |
|---|---|
| Dominio (Flutter + Backend) | ✅ 100% — 23 módulos, misma forma en ambos lados |
| Design System (`core/ui`) | ✅ 100% — componentes + layouts + microinteracciones, adopción obligatoria verificada |
| Navegación (`GoRouter` + `Navigator.push`) | ✅ Estable — rutas base + navegación local documentada, sin cambios previstos para Sprint 3 |
| Estructura de capas por feature | ✅ Estandarizada — `models/repositories/mock/datasources/presentation` idéntica en los 23 features de datos |
| `datasources/` (interfaces) | ✅ 100% — 23/23 features, `Local`/`RemoteDataSource` sin implementación |
| `mappers/`+`dtos/` | 🟡 26% — 6/23 features con el patrón completo y wireado (`security`, `settings`, `trust`, `verification`, `profile`, `provider_dashboard`); 17/23 documentados y auditados como migrables con el mismo patrón (ver sección 4) |
| Tests | ✅ 748 pasando, 0 rotos en 6 prompts consecutivos |
| Backend Presentation/Application | ✅ Esqueleto completo, `Infrastructure/` vacía a propósito |

## 3. Qué sigue siendo mock

- **Los 23 features de datos** en Flutter siguen leyendo de
  `Mock<X>Repository` + `mock/mock_*.dart` — ningún dato viene de una
  API real.
- **Backend**: todos los Use Cases (`application/use_cases/`) lanzan
  `Error("Not implemented yet")`; ningún repositorio de
  `infrastructure/` existe todavía; no hay conexión a base de datos.
- **Autenticación**: `AppRouteGuard` "siempre permite" — no hay
  JWT/OAuth ni sesión real en ningún lado.
- **17 de 23 features** de Flutter aún no tienen `mappers/`/`dtos/`
  (sí tienen `datasources/`) — sus páginas siguen componiendo el
  `Display` inline en `_buildData()`, exactamente como los 6 de
  referencia lo hacían antes del Prompt 56.
- **Shared Kernel** (`Money`/`Timestamp`/`Currency`/`DateRange`):
  especificado en el documento de arquitectura táctica pero no
  implementado en código todavía en ningún lado (ni Flutter ni
  Backend) — recomendado como primera tarea de Sprint 3 antes de tocar
  lógica real de Payment/Quote/Service (ver sección 8, riesgos).

## 4. Componentes que deberán reemplazarse (y cuáles no)

**Se reemplazan cuando llegue el backend:**
- Los 23 `Mock<X>Repository` → `Api<X>Repository` (o
  `Firebase<X>Repository`), implementando el mismo `<X>Repository`
  (contrato sin cambios).
- Las interfaces `<X>LocalDataSource`/`<X>RemoteDataSource` (hoy sin
  implementación) → implementaciones reales (una con `http`/`dio` +
  el `Dto` correspondiente, otra como caché local si se decide tener
  una).
- Los `mock/mock_*.dart` de cada feature → eliminados, reemplazados
  por la respuesta real del `RemoteDataSource`.
- `AppRouteGuard` → guard real de autenticación.

**NO se reemplaza — ya está en su forma final:**
- Todo `core/ui/` (Design System completo).
- Todos los `Display`/`Data`/`Result` models (composición de
  presentación) — sus **campos reales** (derivados de entidades de
  dominio) no cambian; solo sus **campos simulados** (documentados
  explícitamente en cada clase, p. ej. `factors` en `TrustDisplay`)
  eventualmente recibirán un valor real del backend en vez de un mock
  constante, sin cambiar la forma de la clase.
- Todos los `<X>Repository` (contratos) — ya están diseñados para que
  una implementación real los satisfaga sin cambios (varios ya
  documentan explícitamente "una futura `ApiXRepository`
  implementaría esta misma interfaz").
- Toda la navegación, todos los widgets, toda la lógica de UI.

## 5. Orden recomendado para eliminar mocks

Basado en la auditoría de dependencias entre features (quién usa
`Navigator.push` hacia quién, y qué bounded context bloquea a cuál):

1. **Identity & Access** (`identity`, `authentication`, `credentials`)
   — todo lo demás depende de una sesión autenticada real.
2. **Profiles** (`profiles`, `address`, `contact`) — perfil de cuenta,
   base para casi todas las pantallas.
3. **Trust & Compliance** (`trust`, `verification`, `audit`) — depende
   de Identity, pero no de Marketplace/Fulfillment.
4. **Marketplace** (`category`, `service`, `provider`) — catálogo de
   servicios, no depende de Fulfillment/Payments todavía.
5. **Fulfillment** (`availability`, `schedule`, `order`, `quote`) —
   depende de Marketplace (qué servicio) e Identity (quién solicita).
6. **Payments** (`payment`) — depende de que exista una `Order`/`Quote`
   real.
7. **Reputation** (`review`) — depende de que exista una `Order`
   completada real.
8. **Communication** (`chat`, `message`, `attachment`,
   `notification`) — puede ir en paralelo desde el principio (no
   depende de los anteriores más que de Identity), pero tiene sentido
   dejarlo para el final porque es el que menos bloquea a otros.

Este orden **no** implica tocar Flutter en cada paso — implica el
orden en que el Backend gana Infrastructure real, y por lo tanto el
orden en que cada `Mock<X>Repository` de Flutter se vuelve reemplazable
sin quedar bloqueado esperando a otro backend module.

## 6. Estrategia de migración (por feature de Flutter)

Para cada uno de los 23 features de datos, migrar un mock a datos
reales sigue exactamente estos pasos, sin excepción:

1. Implementar `Api<X>RemoteDataSource` (implementa la interfaz ya
   existente) contra el endpoint REST real (ya documentado en Swagger
   por el Backend).
2. Implementar `Api<X>Repository implements <X>Repository`, componiendo
   el `RemoteDataSource` (y opcionalmente el `LocalDataSource` como
   caché).
3. Si el feature no tiene `mapper`/`dto` todavía (17 de 23 — ver
   sección 4 del análisis de auditoría), crearlos siguiendo
   exactamente el patrón de los 6 de referencia (`security`,
   `settings`, `trust`, `verification`, `profile`,
   `provider_dashboard`) — es extracción mecánica, no diseño nuevo.
4. Cambiar **una sola línea** en la `Page`: `MockXRepository()` →
   `ApiXRepository()` (o inyectarlo — Sprint 3 es también el momento
   natural para decidir si se introduce inyección de dependencias,
   fuera de alcance de este documento).
5. Verificar que los widgets no cambian — si el `Display` no cambió de
   forma, no debería hacer falta tocar ningún widget.

**Excepciones documentadas** (ver auditoría completa más abajo):
`marketplace` necesita 3 mappers en vez de 1 (compone 3 repositorios
independientes); `search` necesita que `SearchRepository` gane 2
métodos nuevos (`providerFor`/`categoryFor`) antes de poder tener un
mapper limpio, porque hoy resuelve `provider`/`category` contra listas
mock crudas en vez de a través del repositorio.

## 7. Auditoría de los 17 features sin mapper/DTO — respuestas directas

**¿Todos pueden migrarse con el patrón de los 6 de referencia?**
15 de 17, sí, exactamente igual (13 sin ninguna diferencia; 2 —
`provider_profile` y `service_detail` — con un cálculo de
`averageRating`/`reviewsCount` hecho hoy en la página en vez de como
getter derivado, que se traslada sin fricción al mapper). Ver también
`notifications`, que tiene un pequeño helper de formato de fecha
relativa (`_timeAgo`) que se absorbe igual de fácil.

**¿Existe algún feature que necesite una arquitectura distinta?**
No. Ninguno de los 17 requiere una arquitectura diferente al patrón
`Repository → Mapper → Display` ya validado.

**¿Existe algún caso especial?**
Sí, dos, ambos documentados explícitamente:
- **`marketplace`**: compone 3 repositorios independientes
  (`CategoryRepository`/`ServiceRepository`/`ProviderRepository`) en 3
  listas separadas, sin un único `Display` compuesto — necesita 3
  mappers (uno por repositorio), no 1.
- **`search`**: `SearchRepository` hoy solo expone `getAll()`
  (servicios); la página resuelve `provider`/`category` por cada
  resultado contra listas mock crudas importadas directamente, sin
  pasar por el repositorio. Antes de poder tener un
  `SearchMapper.toDisplay(repository)` limpio, `SearchRepository`
  necesita 2 métodos nuevos.

**¿Existe algún impedimento para migrarlos cuando exista backend?**
No se encontró ningún impedimento estructural. Ningún `Display`
envuelve a otro `Display` (todos componen solo entidades de dominio
reales + primitivos), así que la firma simple
`Mapper.toDisplay({repository, ...simulados})` alcanza en 21 de los 23
casos; los 2 casos especiales (`marketplace`, `search`) tienen una
solución igual de mecánica, solo con una forma ligeramente distinta
(múltiples mappers / repositorio extendido primero).

## 8. Riesgos

- **Riesgo bajo, general**: el diseño actual (`Repository`
  contrato-primero, `Display` ya separado de dominio, Design System ya
  estable) minimiza el riesgo de tener que rehacer trabajo de UI
  cuando llegue el backend — ver sección 9 para la respuesta directa a
  "¿algo nos obligaría a rehacer parte del proyecto?".
- **Riesgo medio — Shared Kernel no implementado**: `Money`/`Timestamp`/
  `Currency`/`DateRange` siguen sin existir como código (documentado
  desde antes de Sprint 1). Si Sprint 3 empieza a implementar lógica
  real de `Payment`/`Quote`/`Service` sin esto, se corre el riesgo de
  fabricar manejo de dinero/fechas ad hoc en cada módulo y tener que
  refactorizar varios módulos a la vez después. **Recomendación**:
  implementarlo primero, antes de cualquier lógica de negocio real.
- **Riesgo medio — paginación/lookup por ID no existe**: todos los
  features de Flutter muestran un registro fijo o una lista fija
  completa (sin paginación, sin lookup por ID real). Cuando el backend
  tenga datos reales (potencialmente miles de órdenes/servicios), las
  páginas necesitarán paginación — no es un bloqueo arquitectónico
  (los widgets de lista ya son independientes de cómo se obtienen los
  datos), pero sí es trabajo nuevo no cubierto por el patrón actual de
  `Repository.getX()` sin parámetros.
- **Riesgo bajo — gestión de estado**: hoy no existe ninguna
  (`StatelessWidget` en toda la app, estado vía `IndexedStack`/
  parámetros de constructor). Sprint 3 va a necesitar alguna forma de
  manejar loading/error/datos reales de forma reactiva — el patrón
  `Repository`/`Mapper` no depende de qué solución se elija
  (Provider/Riverpod/Bloc/etc.), así que no hay riesgo de tener que
  deshacer el trabajo de Sprint 2, pero sí es una decisión pendiente
  y no trivial.
- **Riesgo bajo — autenticación**: `AppRouteGuard` "siempre permite" es
  un placeholder explícito y documentado; reemplazarlo no debería
  tocar ninguna pantalla, solo el guard mismo y el punto de entrada.

## 9. Revisión crítica — ¿algo obligaría a rehacer parte del proyecto?

**No se encontró nada que obligue a rehacer trabajo ya hecho.**
Específicamente se revisó:

- **Estructura de carpetas**: idéntica en los 23 features de datos,
  sin excepciones no documentadas.
- **Separación Domain/Application/UI**: verificada por grep — cero
  imports de `presentation/` dentro de ningún `entities/`/`models/` de
  dominio, y cero imports de dominio/features dentro de `core/ui/`.
  La dirección de dependencia es correcta en ambos sentidos.
- **Repositorios**: 100% mismo naming (`XRepository`/`MockXRepository`),
  ya diseñados contrato-primero.
- **`datasources/`/`mappers/`/`dtos/`**: patrón único, sin variantes
  incompatibles entre sí (confirmado en la auditoría de la sección 7).
- **Design System**: estable desde Sprint 2 Etapa 2, de adopción
  obligatoria, sin deuda pendiente.
- **Navegación**: `GoRouter` (rutas base) + `Navigator.push` (flujos de
  exploración) — documentado como decisión intencional, no accidental;
  no depende de mocks ni de cómo se obtienen los datos.
- **Tests**: 748 pasando, cubren dominio (entidades + value objects) y
  algunos widgets/responsive — ninguno depende de la implementación
  concreta del repositorio (usan `Mock*Repository` directamente o
  datos fijos), así que cambiar a un repositorio real no debería
  romper ninguno.
- **Dependencias** (`pubspec.yaml`): mínimas y limpias — `flutter`,
  `cupertino_icons`, `collection`, `go_router`. Sin paquetes de
  gestión de estado, sin HTTP, sin Firebase — ninguna decisión
  prematura que deshacer.

La única pieza de trabajo que **si se hiciera mal en Sprint 3 podría
forzar un rehacer** es el Shared Kernel (`Money`/`Timestamp`) — ver
sección 8 — precisamente porque no existe todavía, no porque algo ya
construido esté mal.

## 10. Dependencias entre features (para planear el orden de Sprint 3)

Ver sección 5 para el orden recomendado por Bounded Context. A nivel
de features de Flutter individuales, las dependencias de navegación
(qué pantalla abre a cuál) ya están documentadas en
`PROJECT_STATUS.md` sección 4 y no cambian con esta preparación.

## 11. Roadmap completo de Sprint 3

```
Infraestructura Backend (conexión a base de datos, config, migraciones)
        ↓
Shared Kernel (Money / Timestamp / Currency / DateRange)
        ↓
Identity & Access
  Identity → Authentication → Credentials
        ↓
Autenticación real end-to-end (login/registro Flutter ↔ backend, AppRouteGuard real)
        ↓
Profiles
  Profiles → Address → Contact
        ↓
Trust & Compliance
  Trust → Verification → Audit
        ↓
Marketplace
  Category → Service → Provider
        ↓
Fulfillment
  Availability → Schedule → Order → Quote
        ↓
Payments
  Payment
        ↓
Reputation
  Review
        ↓
Communication
  Chat → Message → Attachment → Notification
```

### Por qué este orden es el correcto

1. **Infraestructura Backend primero**: sin conexión real a una base
   de datos, ningún `ApiXRepository` tiene nada que implementar contra
   qué — es el prerrequisito literal de todo lo demás.
2. **Shared Kernel antes que cualquier módulo de negocio**: `Payment`,
   `Quote` y `Service` ya modelan precios/fechas; implementarlos sin
   `Money`/`Timestamp` reales fuerza a fabricar manejo de dinero/fechas
   ad hoc en 3+ módulos que después habría que unificar — más barato
   resolverlo una vez, antes.
3. **Identity & Access antes que todo lo demás**: los 7 Bounded
   Contexts restantes, sin excepción, necesitan saber "quién es el
   usuario actual" — `Profiles`, `Trust`, `Marketplace` (como
   proveedor autenticado), `Fulfillment` (quién solicita/quién
   atiende), `Payments` (quién paga), `Reputation` (quién califica) y
   `Communication` (quién chatea) todos referencian una `Identity`
   real. Sin esto, cualquier avance en otro Bounded Context es
   provisional.
4. **Autenticación end-to-end (Flutter ↔ Backend) inmediatamente
   después**: valida que el primer flujo completo funciona (login real
   reemplazando `AppRouteGuard`) antes de invertir en los 6 Bounded
   Contexts restantes — si algo del diseño de sesión/token falla, se
   descubre temprano y barato.
5. **Profiles antes que Trust/Marketplace**: `Trust`/`Verification`
   referencian `Identity`/`Profile`; `Marketplace.Provider` referencia
   `Profile` para el nombre para mostrar. Profile es la pieza de datos
   más reutilizada después de Identity.
6. **Trust & Compliance antes que Marketplace**: conceptualmente,
   un proveedor necesita poder tener un estado de confianza/verificación
   antes de que tenga sentido mostrarlo en el catálogo — y
   `provider_profile`/`verification`/`trust` en Flutter ya son
   pantallas que se abren desde el mismo flujo que `Marketplace`.
7. **Marketplace antes que Fulfillment**: no se puede solicitar un
   servicio (`request_service`/`quote`/`order`) que no existe en el
   catálogo todavía — `Category`/`Service`/`Provider` son prerrequisito
   de dato, no solo de UI.
8. **Fulfillment antes que Payments**: no existe nada que pagar sin
   una `Order`/`Quote` real primero — `Payment` en el dominio ya
   referencia `Order`/`Quote` por ID, así que el orden de dependencia
   de datos es literal, no solo conveniencia.
9. **Reputation después de Fulfillment**: `Review` solo tiene sentido
   sobre una `Order` ya completada — no hay nada que calificar antes.
10. **Communication al final, pero independiente**: `Chat`/`Message`/
    `Attachment`/`Notification` solo dependen de `Identity` (quién
    envía/recibe) — técnicamente podrían implementarse en paralelo
    desde el punto 4 en adelante. Se dejan al final porque son los que
    **menos bloquean** a otros Bounded Contexts, no porque dependan de
    ellos — es la pieza con más flexibilidad de calendario si Sprint 3
    necesita reordenarse por prioridad de negocio en vez de por
    dependencia técnica pura.

## 12. Recomendaciones

1. Implementar el Shared Kernel (`Money`/`Timestamp`/`Currency`/
   `DateRange`) en el Backend antes de tocar lógica real de
   Payment/Quote/Service.
2. Seguir el orden de Bounded Context de la sección 5 — empezar por
   Identity & Access, no por el feature que parezca más sencillo.
3. Extraer `mappers/`/`dtos/` de los 17 features restantes **antes**
   de que cada uno reciba su implementación real de repositorio —
   son cambios mecánicos, bajo riesgo, y dejan cada feature en el
   mismo estado exacto que los 6 ya migrados.
4. Resolver `marketplace` (3 mappers) y `search` (extender
   `SearchRepository`) como casos explícitos, no como parte del lote
   genérico de 17.
5. Decidir la solución de gestión de estado (Provider/Riverpod/Bloc/
   etc.) **antes** de empezar a reemplazar el primer `MockRepository`,
   ya que afecta cómo cada `Page` va a consumir el `Repository` real
   (hoy es una llamada síncrona; con red real, será asíncrona).
6. No paralelizar el reemplazo de mocks entre Bounded Contexts sin
   verificar primero que Identity & Access esté completo — casi todo
   lo demás depende de una sesión real.
