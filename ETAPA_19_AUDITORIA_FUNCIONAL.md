# AUDITORÍA FUNCIONAL INTEGRAL — PREPARACIÓN ETAPA 19

**Fecha:** 2026-08-14
**Alcance:** Estado real del código en `main` tras la Etapa 18 (seguridad/autorización). Auditoría **exclusivamente funcional** — no se repite seguridad, arquitectura, Clean Architecture, calidad de código, organización de carpetas, rendimiento ni documentación (ya auditado en etapas previas).
**Metodología:** 5 auditorías de solo lectura ejecutadas en paralelo (flujo cliente end-to-end, flujo proveedor end-to-end, navegación y botones, integración frontend↔backend y datos falsos, consistencia de enums + panel admin + regresiones), más re-ejecución directa de las 6 pruebas obligatorias. **No se modificó ningún archivo.**

---

## 1. RESUMEN EJECUTIVO

**Estado real del proyecto: prototipo funcional avanzado, no un producto v1.0.**

**Porcentaje estimado de completitud funcional: ~55-60%.** La arquitectura, la seguridad (Etapa 18) y buena parte de las pantallas están sólidas y bien construidas — pero **tres rupturas de cadena completa** impiden que un usuario real complete los flujos centrales de la app tal como está hoy desplegada.

**¿Está lista para una v1.0? NO.**

**Justificación — 3 bloqueantes que, por sí solos, ya descartan un lanzamiento:**

1. **El registro de cualquier cuenta nueva falla siempre en el último paso** (`POST /profiles` devuelve 401/403 porque se llama sin sesión iniciada). Toda cuenta creada desde la app queda huérfana, sin Profile, con Perfil/Configuración/Home rotos. Este bug existe desde antes de la Etapa 18 pero el endurecimiento de Etapa 18 lo confirma y lo hace imposible de esquivar.
2. **Ningún proveedor puede llegar nunca a estado `Active`.** La Etapa 18 (correctamente) restringió la aprobación de `ProviderStatus`/`VerificationStatus` a `Role.Admin` — pero **no existe ningún mecanismo en todo el sistema que emita ese rol**. No hay panel de administración, no hay script, no hay seed de producción. Un usuario que complete el wizard "Convertirse en proveedor" queda parado en "Pendiente" para siempre. Todo el lado proveedor de la app (servicios, disponibilidad, agenda, cotizaciones) depende de superar ese estado.
3. **Publicar una reseña falla siempre en modo real** (`POST /reviews` envía un campo `status` que el nuevo `ValidationPipe` de Etapa 18 rechaza con 400).

A esto se suman: 4 pantallas completamente inaccesibles (Categorías, Buscar, Pagos, Seguimiento), un botón crítico del proveedor ("Rechazar solicitud") que devuelve un error técnico en inglés tras un diálogo irreversible, el chat que abre sistemáticamente la conversación equivocada, las reseñas de un proveedor mostrando las de **todos** los proveedores del sistema, y 14 datos inventados presentados como reales en cualquier build (nombre del usuario, estadísticas del dashboard, referencias de pago, etc.).

**Lo que sí funciona y está bien hecho:** login, recuperación de sesión, marketplace, órdenes (cliente), configuración, cierre de sesión, el CRUD de servicios del proveedor (una vez superado el bloqueo de rol), iniciar/finalizar orden, el wizard de verificación de documentos (6 de 7 tipos), y toda la capa de seguridad de Etapa 18 — que hace exactamente lo que debía hacer. El problema de esta etapa no es que el endurecimiento de seguridad esté mal: es que **nadie conectó los cabos que ese endurecimiento dejó sueltos** (el registro, la aprobación de proveedores, el DTO de reseñas).

---

## 2. HALLAZGOS CLASIFICADOS

### 🔴 BLOQUEANTES (impiden publicar v1.0 sin excepción)

1. **Registro roto**: `POST /profiles` (paso 4 del registro) requiere JWT que aún no existe → 401. Cuenta creada sin Profile, permanentemente incompleta. *(`apps/mobile/lib/features/register/repositories/http_register_repository.dart:42-75`, `apps/backend/src/modules/profiles/presentation/controllers/profile.controller.ts:89`)*
2. **Ningún proveedor puede activarse nunca**: `Role.Admin` no lo emite nada en el sistema; sin él, `PUT /providers/:id` con `status: ACTIVE` es imposible. No hay panel admin, ni script, ni seed de producción que lo resuelva. *(`apps/backend/src/common/auth/role.enum.ts:6-8`, `apps/backend/src/modules/authentication/application/use_cases/login.use-case.ts:117-123`, `apps/backend/src/modules/provider/application/use_cases/update-provider.use-case.ts:67-80`)*
3. **Publicar reseña falla siempre**: el móvil envía `'status': 'PUBLISHED'`, campo inexistente en `CreateReviewRequestDto`; con `forbidNonWhitelisted:true` (Etapa 18) → 400. *(`apps/mobile/lib/features/reviews/repositories/http_reviews_repository.dart:100`, `apps/backend/src/modules/review/presentation/dto/create-review.request.dto.ts:29-76`)*
4. **"Rechazar solicitud" del proveedor siempre falla con 403**, tras un diálogo de confirmación irreversible, mostrando un mensaje técnico en inglés con un UUID crudo. *(`apps/mobile/lib/features/orders/presentation/pages/provider_requests_page.dart:96-98,182-211`, `apps/backend/src/modules/order/application/authorization/order-access.ts:33-35`)*
5. **Subir "Documento de identidad" o "Certificado de educación" en el wizard de proveedor puede crashear la pantalla** (null-check operator sobre `null` en runtime) por un mapeo de enum incompleto. *(`apps/mobile/lib/features/become_provider/presentation/widgets/documentation_step.dart:104`, `apps/mobile/lib/features/become_provider/repositories/http_become_provider_repository.dart:124-138`)*

### 🟠 ALTA (rompen un flujo central o exponen datos incorrectos)

6. Chat abre siempre la primera conversación de la lista, sin importar cuál se toque — con 2+ conversaciones activas, el usuario escribe en la equivocada. *(`apps/mobile/lib/features/chat/presentation/pages/chat_page.dart:27-33`, `apps/mobile/lib/features/chat/repositories/http_chat_repository.dart:37-47`)*
7. "Reseñas recibidas" del proveedor muestra las reseñas de **todos** los proveedores del sistema, sin filtrar, con nombres de reseñador inventados ("Usuario"). *(`apps/mobile/lib/features/reviews/presentation/view_models/reviews_view_model.dart:37`, `apps/backend/src/modules/review/application/use_cases/list-review.use-case.ts:11-19`)*
8. Disponibilidad y Agenda del proveedor son **de solo lectura** — el backend tiene CRUD completo pero el móvil nunca lo consume; el proveedor no puede editar su horario desde la app. *(`apps/mobile/lib/features/availability/repositories/http_availability_repository.dart`, `apps/mobile/lib/features/schedule/repositories/http_schedule_repository.dart`)*
9. 4 pantallas completamente inaccesibles desde cualquier punto de navegación: Categorías, Buscar, Pagos, Seguimiento (tracking). *(ver sección 6)*
10. El build por defecto de la app es 100% Mock (`useMockBackend` por defecto `true`) — cualquier APK compilado sin el flag explícito nunca toca el backend real, sin ninguna indicación visual al usuario. *(`apps/mobile/lib/core/network/api_config.dart:29-32`)*
11. Notificaciones: el botón de acción de cada notificación no hace nada, y "marcar como leída" nunca se persiste en el backend pese a que el endpoint existe. *(`apps/mobile/lib/features/notifications/presentation/widgets/notification_actions.dart:17-21`, `apps/mobile/lib/features/notifications/repositories/http_notifications_repository.dart:33`)*
12. Sin recuperación de contraseña en toda la aplicación — el enlace solo muestra un diálogo "no disponible, escribe a soporte". *(`apps/mobile/lib/features/login/presentation/pages/login_page.dart:144-163`)*
13. Perfil de proveedor consumido por el cliente usa `items.first` de `GET /providers` en un punto (fallback), en vez de resolver por sesión — riesgo de mostrar el proveedor equivocado si se invoca sin contexto previo. *(`apps/mobile/lib/features/provider_profile/repositories/http_provider_profile_repository.dart:42-49`)*
14. `POST /payments`, `PUT /notifications/:id/read`, `PUT/DELETE /reviews`, `PUT /chats/:id/close`, subida de adjuntos de chat, y descarga de documento de verificación: **endpoints backend completos que la app nunca invoca**, dejando funcionalidad visible en la UI (o descrita) sin ningún efecto real.

### 🟡 MEDIA (degradan la experiencia o son inconsistencias menores)

15. Listas paginadas que el móvil filtra 100% client-side sin pedir la página correcta (cotizaciones, reseñas, disponibilidad, servicios) — con más datos que el tamaño de página por defecto, información real "desaparece" sin aviso.
16. Datos hardcodeados/simulados mostrados como reales en cualquier build (ver sección 5) — el más visible: saludo "Hola, María/Carlos" y panel de estadísticas del proveedor en Home (3 órdenes / 5 servicios / 4.8★ / disponible).
17. `rating` de reseña tipado como `num` en el móvil vs `@IsInt()` en el backend — un rating con decimales causaría 400.
18. Toggle "Disponible/Ocupado" del proveedor en Home solo escribe en almacenamiento local del dispositivo — nunca llega al backend, ningún cliente ve el cambio real.
19. Botón "Ver recibo" de un pago abre el Chat en vez de un recibo.
20. Tres implementaciones independientes y desincronizadas del diálogo de "Cerrar sesión" (Drawer, Configuración, Perfil).
21. `service_locator.dart` no contempla la rama `'ADMIN'` al sincronizar el rol del backend con el controlador de rol local — statement no exhaustivo sin `default` (hoy inocuo, pero silencioso si algún día se emite Admin).
22. `HttpProviderServicesRepository` envía `status.name.toUpperCase()` en vez de pasar por el puente genérico de enums — funciona hoy por casualidad de nombres de una sola palabra.

### 🟢 BAJA (cosmético o de bajo impacto práctico)

23. 71 de 133 endpoints del backend (53%) nunca se usan desde el móvil — superficie muerta, no un bug, pero indica funcionalidad a medio conectar.
24. Cámara del mapa en Home fija en un punto de Bogotá en vez de la ubicación real del usuario (el punto azul de ubicación sí es real).
25. `HttpSettingsRepository.getOptions()` devuelve una constante local en vez de consultar el backend (inocuo, es solo el menú de opciones, no datos de usuario).
26. Dos implementaciones Dart independientes de `GET /categories` (una en `features/categories`, otra en `features/marketplace`).
27. Endpoint `POST /quotes` duplicado desde dos repositorios distintos del móvil con cuerpos idénticos.

---

## 3. LISTA COMPLETA DE BUGS (consolidada, uno por uno)

1. Registro: paso 4 (`POST /profiles`) falla con 401, cuenta huérfana sin Profile.
2. Ningún proveedor puede alcanzar `ProviderStatus.Active` — deadlock total, sin mecanismo de aprobación real.
3. `POST /reviews` rechazado con 400 por campo `status` no declarado en el DTO.
4. `rating` de reseña puede enviarse como decimal desde el móvil, incompatible con `@IsInt()` del backend.
5. Botón "Rechazar solicitud" del proveedor devuelve 403 siempre (llama a `cancel`, no a un "rechazo" real), mostrando error técnico en inglés con UUID crudo, tras diálogo irreversible.
6. Subida de "Documento de identidad" o "Certificado de educación" puede crashear el wizard de proveedor por un enum mal mapeado (`identityDocument`/`educationCertificate` colisionan con `document`/`certification` en el wire, y el resultado del mapeo inverso se descarta).
7. Chat abre siempre la primera conversación de `GET /chats`, nunca la que el usuario tocó — afecta a los 6 puntos de entrada al chat (lista de conversaciones, orden del cliente, solicitud del proveedor, panel del proveedor, tras aceptar cotización).
8. "Reseñas recibidas" del proveedor muestra las reseñas de todo el sistema sin filtrar por proveedor.
9. Nombre del reseñador, si la reseña es propia y si es editable se resuelven contra mapas mock indexados por id — con datos reales, siempre caen en "Usuario"/false.
10. Disponibilidad del proveedor: solo lectura, sin crear/editar/borrar desde la app pese a que el backend lo soporta.
11. Agenda del proveedor: solo lectura, sin ningún botón de acción, mismo motivo.
12. Pantalla `CategoriesPage` sin ningún punto de entrada — inaccesible.
13. Pantalla `SearchPage` sin ningún punto de entrada — inaccesible (la pestaña "Buscar" abre Marketplace, no esta pantalla).
14. Pantalla `PaymentsPage` sin ningún punto de entrada — inaccesible; además, si se alcanzara, mostraría un único pago arbitrario (`items.first`), no los pagos reales del usuario.
15. Pantalla `OrderTrackingPage` sin ningún punto de entrada — inaccesible; además su repositorio es Mock permanente, sin contraparte HTTP.
16. `ApiConfig.useMockBackend` por defecto `true` — build sin flag explícito corre 100% offline sin indicación al usuario.
17. Botón de acción de cada notificación no hace nada (`onPressed ?? () {}` sin callback real asignado).
18. "Marcar notificación como leída" nunca llama al backend pese a que el endpoint existe — el filtro "No leídas" nunca se puede vaciar.
19. Sin recuperación de contraseña en toda la app.
20. Registro/reenvío de proveedor rechazado: funciona correctamente (verificado, no es bug) — se documenta para contraste.
21. Toggle "Disponible/Ocupado" del proveedor solo persiste localmente, nunca en backend.
22. Botón "Ver recibo" de un pago completado abre el Chat en vez de mostrar el recibo.
23. Botón "Seleccionar" en direcciones (`AddressActions.onSelect`) nunca recibe callback — no hace nada.
24. Botones "Editar"/"Ver detalle" de una reseña (`ReviewActions.onPressed`) nunca reciben callback — no hacen nada.
25. Tap sobre "Solicitar servicio"/"Publicar solicitud abierta" en el perfil de un proveedor sin servicios/categorías: retorno silencioso, sin feedback.
26. Grid de categorías (pantalla huérfana `CategoriesPage`) sin `onTap` en las tarjetas — no respondería aunque fuera alcanzable.
27. `SelectRolePage` → "Continuar como Proveedor" no verifica si la cuenta realmente tiene un Provider activo antes de llevar al shell de proveedor (a diferencia del switch de rol del drawer, que sí lo hace) — dead-end.
28. Tres implementaciones independientes de "Cerrar sesión" (Drawer, Configuración, Perfil) — funcionan pero están desincronizadas como código.
29. Tres implementaciones GetX/HTTP separadas de "obtener mis categorías" (`categories` vs `marketplace`).
30. `POST /quotes` duplicado desde `http_quote_repository.dart` y `http_orders_repository.dart` con cuerpos idénticos.
31. `HttpProviderServicesRepository` no usa el puente genérico de enums al enviar `status` — frágil ante cambios futuros.
32. `service_locator.dart` no maneja la rama `'ADMIN'` al sincronizar rol backend→local — silenciosamente ignorado.
33. 14 datos hardcodeados mostrados como reales en cualquier build (detalle en sección 5).
34. Cámara del mapa de Home fija en Bogotá centro, no en la ubicación real del usuario.
35. Filtrado 100% client-side sobre listas paginadas sin filtro server-side real (cotizaciones, reseñas, servicios, disponibilidad, direcciones) — riesgo de datos "desaparecidos" con más registros que el tamaño de página.
36. `estimatedArrival` de una orden sale de un mapa mock con fallback `'—'`.
37. Dirección usada en "Solicitar servicio" es simplemente la primera de la lista del cliente — sin selector.
38. `HttpSettingsRepository.getOptions()` devuelve una constante local, no datos del backend (bajo impacto).

---

## 4. FUNCIONALIDADES INCOMPLETAS

- **Disponibilidad del proveedor** — solo lectura, sin mutaciones (el backend las soporta).
- **Agenda del proveedor** — solo lectura, sin ningún botón de acción.
- **Notificaciones** — sin acción al tocar, sin marcar como leída.
- **Pagos** — pantalla existente pero inalcanzable y con datos incorrectos (`items.first`); sin creación real de pagos desde la app en ningún flujo.
- **Adjuntos de chat** — el backend tiene el endpoint, el móvil nunca sube un adjunto real.
- **Descarga/previsualización de documento de verificación** — se suben documentos pero nunca se recuperan desde la app (el endpoint autenticado de Etapa 18 existe y no se usa).
- **Recuperación de contraseña** — inexistente end-to-end.
- **Aprobación de proveedores/verificaciones (panel administrativo)** — inexistente por completo (ver sección 11).
- **Búsqueda real** — la pantalla de búsqueda dedicada es inaccesible; lo único funcional es un filtro client-side dentro de Marketplace.

---

## 5. FUNCIONALIDADES FALSAS (datos mock mostrados como reales, en cualquier build)

| # | Dato | Valor fijo | Dónde se ve |
|---|---|---|---|
| 1 | Nombre de saludo en Home | `'María'` (cliente) / `'Carlos'` (proveedor) | Home, cabecera |
| 2 | Órdenes pendientes (Home proveedor) | `3` | Home del proveedor |
| 3 | Servicios publicados (Home proveedor) | `5` | Home del proveedor |
| 4 | Calificación (Home proveedor) | `4.8` | Home del proveedor |
| 5 | Estado "disponible" (Home proveedor) | `true` | Home del proveedor |
| 6 | Estado en línea del interlocutor del chat | "Activo hace 2 min" | Cabecera del chat |
| 7 | Referencia/número de recibo de pago | `'TRX-2026-000123'` / `'REC-000456'` | Detalle de pago |
| 8 | % de completitud del perfil + tareas pendientes | `75%` + 2 ítems fijos | Perfil del cliente |
| 9 | Factores que "explican" el score de confianza | 4 frases fijas | Pantalla de Confianza |
| 10 | Galería y descripción del detalle de servicio | 4 rótulos + párrafo fijo de plomería | Detalle de servicio |
| 11 | Portadas del perfil de proveedor | 2 etiquetas fijas | Perfil de proveedor |
| 12 | "Ahora" congelado para antigüedad de notificaciones | `10 ene 2026, 12:00` | Notificaciones — con backend real produce antigüedades absurdas |
| 13 | Hora/prioridad preseleccionadas + "ubicación simulada" | `10:00`, prioridad normal, etiqueta "simulada" | Solicitar servicio |
| 14 | Menú de Configuración | 7 opciones fijas devueltas por el repositorio HTTP | Configuración |

Adicionalmente, 5 puntos de datos con **fallback neutro** (no inventan, pero muestran placeholders con backend real): nombre de reseñador → "Usuario"; distancia en búsqueda → 1.0 km; nº de servicios por categoría → 0; ETA de orden → "—"; dirección predeterminada → false.

**Correctamente aislado (no es un problema):** los ~26 archivos de entidades mock por feature solo se instancian cuando `useMockBackend=true` — el diseño del toggle en sí es correcto; el problema son estas 14 constantes que viven fuera de ese aislamiento.

---

## 6. PANTALLAS INACCESIBLES

| Pantalla | Motivo |
|---|---|
| `CategoriesPage` | Sin ningún punto de navegación real en toda la app |
| `SearchPage` | Sin ningún punto de navegación real; la pestaña "Buscar" del shell monta `MarketplacePage` en su lugar |
| `PaymentsPage` | Sin ningún punto de navegación real; ni en el shell, ni el drawer, ni configuración |
| `OrderTrackingPage` | Sin ningún punto de navegación real, y su repositorio es Mock permanente sin contraparte HTTP |

**Pantallas duplicadas o de propósito solapado:** `SearchPage` vs. `MarketplacePage` (Marketplace absorbió la búsqueda); `CategoriesPage` vs. `CategoriesSection`/`QuickCategories`; `OrdersPage` vs. `ProviderRequestsPage` (ambas exponen historial en el shell del proveedor); `SettingsPage` vs. `AppDrawer` vs. `ProfilePage` (3 implementaciones de cerrar sesión y opciones solapadas).

---

## 7. BOTONES MUERTOS (consolidado de la auditoría de navegación)

- **7 botones "No hace nada"**: Seleccionar (dirección), acción de notificación, editar/ver detalle de reseña, solicitar servicio sin servicios disponibles, publicar solicitud abierta sin categorías, tarjetas del grid de categorías (pantalla huérfana).
- **9 botones "Hace algo incorrecto"**: Rechazar solicitud (cancela en vez de rechazar), los 5 puntos de entrada al chat que abren la conversación equivocada, Ver recibo (abre chat), Disponible/Ocupado (solo local), Continuar como Proveedor sin verificar estado real.
- **4 botones "Solo Próximamente"**: Adjuntar fotografía en solicitud, Pagar/Reintentar/Ver información (pantalla de pagos), Chat desde perfil de proveedor sin solicitud previa, ¿Olvidaste tu contraseña?.
- **7 botones "Nunca puede ejecutarse"**: todos los de las 4 pantallas huérfanas (Pagos, Buscar, Categorías, Seguimiento) más la rama inalcanzable de acciones de orden del cliente (aceptar cotización/iniciar/completar — el journey del cliente nunca las emite).
- **10 parámetros de callback opcionales**, 3 de ellos sin ningún call site real que los asigne (`AddressActions.onSelect`, `NotificationActions.onPressed`, `ReviewActions.onPressed`).

---

## 8. ENDPOINTS MAL CONECTADOS

**Total: 133 endpoints backend · 62 usados por el móvil · 71 nunca usados (53%).**

**Rotos por mismatch de contrato (críticos):**
- `POST /reviews` — campo `status` enviado por el móvil no existe en el DTO → 400.
- `POST /profiles` (registro) — llamado sin sesión, el endpoint exige JWT → 401/403.

**Backend-only, sin ningún consumidor en el móvil (selección de los más relevantes):** `POST /payments`, `PUT /notifications/:id/read`, `PUT /reviews/:id`, `DELETE /reviews/:id`, `PUT /chats/:id/close`, `POST /attachments`, `GET /verifications/:id/document`, `PUT /orders/:id`, `POST/PUT/DELETE /availabilities`, `POST/PUT/DELETE /schedules`, los 22 endpoints `GET /*/search`.

**Duplicados desde el lado móvil:** `POST /quotes` invocado desde dos repositorios distintos; `GET /categories` con dos implementaciones Dart independientes.

**Filtrado client-side sobre lo que debería ser server-side:** `/profiles`, `/providers`, `/availabilities`, `/messages`, `/attachments`, `/quotes`, `/reviews`, `/chats` — el móvil descarga la lista completa (o la primera página) y filtra localmente.

---

## 9. FLUJO CLIENTE — PASO A PASO

| Paso | Veredicto |
|---|---|
| Registro | **Roto** |
| Login | Funciona correctamente |
| Recuperación de sesión | Funciona correctamente |
| Home | Funciona parcialmente (datos falsos + error silencioso en categorías rápidas) |
| Marketplace | Funciona correctamente |
| Categorías (pantalla dedicada) | **Inaccesible** |
| Búsqueda (pantalla dedicada) | **Inaccesible** — reemplazada de facto por el filtro de Marketplace |
| Perfil de proveedor (visto por cliente) | Funciona parcialmente |
| Solicitud de servicio | Funciona parcialmente (dirección arbitraria, sin selector) |
| Cotizaciones | Funciona parcialmente (riesgo de paginación) |
| Chat | Funciona parcialmente / efectivamente roto con más de una conversación |
| Órdenes | Funciona correctamente |
| Seguimiento | **Inaccesible + Mock forzado** |
| Reseñas (crear) | **Roto** (400 por campo `status`) |
| Reseñas (leer, para cliente) | **Inaccesible** — solo se ve dentro del perfil de proveedor |
| Notificaciones | Funciona parcialmente (sin acción, sin marcar leída) |
| Perfil | Funciona parcialmente (dato de "progreso" inventado) |
| Configuración | Funciona correctamente |
| Cierre de sesión | Funciona correctamente |

---

## 10. FLUJO PROVEEDOR — PASO A PASO

| Paso | Veredicto |
|---|---|
| Registro (cliente base) | **Roto** (mismo bug del flujo cliente) |
| Become Provider (wizard 5 pasos) | Funciona parcialmente — envía bien, la aprobación es inalcanzable |
| Reenvío tras rechazo (Rejected→Pending) | Funciona correctamente |
| Dashboard | Funciona parcialmente |
| Servicios | Funciona correctamente **una vez superado el bloqueo de rol** |
| Disponibilidad | **Incompleto** — solo lectura |
| Agenda | **Incompleto** — solo lectura |
| Solicitudes | Funciona parcialmente |
| Botón "Rechazar solicitud" | **Roto** — 403 sistemático |
| Iniciar / Finalizar orden | Funciona correctamente |
| Cotizaciones (enviar) | Funciona correctamente, bloqueado por rol |
| Chat | **Roto** en selección de conversación |
| Órdenes (historial) | Funciona correctamente |
| Pagos | **Inaccesible** |
| Reseñas recibidas | **Roto** — sin filtrar, nombres falsos |
| Perfil del proveedor | Funciona parcialmente |
| Configuración | Funciona parcialmente (opciones hardcodeadas) |

**Nota central de este flujo:** casi todos los pasos marcados "funciona correctamente" están, en la práctica, bloqueados por el Hallazgo Bloqueante #2 (ningún proveedor llega a `Active`) — el veredicto por paso describe si el *código* de ese paso es correcto, no si un usuario real puede llegar a usarlo hoy.

---

## 11. FLUJO ADMINISTRADOR — PASO A PASO

**No existe ningún flujo de administrador. No hay panel de administración, ni en el backend ni en el móvil, ni como aplicación separada.**

- No hay módulo `admin` en el backend.
- `Role.Admin` está definido en el enum pero **no lo emite ningún flujo real** — se deriva únicamente en login/refresh, y esa derivación es binaria (Customer/Provider), sin ninguna rama que produzca Admin.
- No hay columna ni modelo de rol persistido en `schema.prisma` — el rol siempre se deriva, nunca se guarda.
- No hay seed ni script de creación de cuenta administrativa en `package.json`.
- Los únicos tokens con rol `ADMIN` en todo el repositorio son firmados por un helper de pruebas (`test/support/sign-test-token.ts`), usado solo en tests e2e.
- **Consecuencia:** el único endpoint capaz de aprobar un proveedor o una verificación (`PUT /providers/:id`, `PUT /verifications/:id`) es, en la práctica, inalcanzable por cualquier actor real del sistema. Las únicas vías de facto hoy son: (a) el seed de desarrollo que crea directamente un Provider con `status: ACTIVE`, (b) un `UPDATE` manual en la base de datos, o (c) forjar a mano un JWT con `role: ADMIN` usando el secreto de producción.
- `ProviderStatus.InReview` existe en el enum pero **ningún caso de uso del backend lo asigna nunca** — es un estado muerto en la práctica.

**Qué haría falta como mínimo para que exista un flujo de aprobación real** (solo descripción, sin implementar):
1. Una fuente de verdad para el rol Admin — hoy no hay ni columna ni tabla; el rol se deriva en cada login sin persistencia.
2. Una forma de crear la primera cuenta admin (seed o script CLI) — hoy no existe ninguna.
3. Endpoints de bandeja de revisión: filtrar Providers/Verifications por estado pendiente (hoy `ListProviderQuery`/`SearchProviderQuery` no tienen filtro por `status`).
4. Transiciones de estado explícitas y validadas (máquina de estados real: `Pending → InReview → Active|Rejected`, `Active → Suspended|Blocked`), con motivo de rechazo persistido — hoy `status` es un campo libre en un PUT genérico.
5. Una regla que conecte la aprobación de las verificaciones KYC con la activación del Provider — hoy no existe relación alguna entre ambos módulos.
6. Alguna superficie de UI para operarlo — hoy no hay ninguna, ni web ni móvil.
7. Notificación al proveedor del resultado de la revisión.
8. Ajustar el móvil para contemplar la rama `'ADMIN'` en la sincronización de rol (hoy la ignora silenciosamente).

---

## 12. RIESGOS PARA PUBLICAR LA v1.0

1. **Ningún usuario nuevo puede completar el registro con éxito** — riesgo de abandono del 100% en el primer contacto con la app.
2. **Ningún proveedor real puede empezar a operar** — el negocio de dos lados (marketplace) no puede arrancar del lado de la oferta.
3. **Las reseñas, el mecanismo de confianza central de un marketplace, no se pueden publicar.**
4. **El chat, canal de comunicación cliente-proveedor, filtra mensajes entre conversaciones** — riesgo de exposición de información entre usuarios distintos y de confusión grave en producción.
5. **Un botón visible e importante para el proveedor ("Rechazar solicitud") falla siempre**, con un mensaje de error que ningún usuario final entendería, dañando la percepción de calidad del producto en el primer uso real.
6. **Sin recuperación de contraseña** — cualquier usuario que la olvide queda bloqueado permanentemente de su cuenta sin soporte automatizado.
7. **Datos inventados mostrados como reales** (estadísticas del dashboard, nombre de saludo) son un riesgo de credibilidad directo frente a usuarios piloto reales, que notarán inmediatamente que los números no corresponden a su actividad real.
8. **El build por defecto es offline (Mock)** — riesgo operativo de distribuir por error una versión que nunca toca producción, sin ninguna señal visible que lo delate.

---

## 13. PLAN DE CORRECCIÓN — ETAPA 19: ESTABILIZACIÓN Y CIERRE FUNCIONAL

*(Solo enumeración de lo que habrá que corregir — sin código, sin soluciones, sin commits, tal como se pidió.)*

### Prioridad crítica (bloqueantes de v1.0)
1. Corregir el flujo de registro para que el paso de creación de Profile no dependa de una sesión que aún no existe (reordenar el flujo, o hacer login antes del último paso, o exponer el endpoint de forma compatible con el registro anónimo).
2. Definir e implementar un mecanismo real de emisión del rol Admin y de aprobación de Provider/Verification — como mínimo: fuente de verdad del rol, forma de crear la primera cuenta admin, y transición explícita Pending/InReview→Active.
3. Alinear el DTO de creación de reseña entre móvil y backend (eliminar el campo `status` que el móvil envía y que el backend no admite, o exponerlo si corresponde a una regla de negocio real).
4. Corregir el botón "Rechazar solicitud" del proveedor para que no llame al mismo endpoint que "Cancelar orden" de un tercero no autorizado.
5. Corregir el mapeo de `VerificationType` para los dos tipos de documento que hoy colisionan y pueden crashear el wizard de proveedor.

### Prioridad alta
6. Corregir el chat para que abra siempre la conversación correcta (pasar el identificador real en cada uno de los 6 puntos de entrada).
7. Escopar "Reseñas recibidas" del proveedor a sus propias reseñas.
8. Decidir e implementar edición real de Disponibilidad y Agenda desde el móvil, o retirar/reetiquetar esas pantallas si se pospone.
9. Conectar o retirar las 4 pantallas inaccesibles (Categorías, Buscar, Pagos, Seguimiento) — decisión de producto: completarlas o eliminarlas del código para no dejar features fantasma.
10. Decidir el valor por defecto de `useMockBackend` para builds de release, o al menos agregar una señal visual clara cuando la app corre en modo offline.
11. Conectar "marcar notificación como leída" y dar una acción real al botón de cada notificación.
12. Implementar recuperación de contraseña, o documentar explícitamente que queda fuera de esta versión y comunicarlo al usuario de forma más clara que un diálogo genérico.

### Prioridad media
13. Reemplazar los 14 datos hardcodeados que se muestran como reales por datos derivados reales o estados vacíos honestos.
14. Revisar y decidir qué hacer con los 71 endpoints backend nunca usados: conectar, documentar como reservados, o retirar.
15. Agregar filtrado server-side real (o paginación consciente) a las listas que hoy se filtran 100% client-side (cotizaciones, reseñas, servicios, disponibilidad, direcciones, chats, mensajes).
16. Corregir el tipo de `rating` en el móvil para que sea consistente con la validación entera del backend.
17. Conectar el toggle "Disponible/Ocupado" del proveedor al backend.
18. Corregir el destino del botón "Ver recibo" de un pago.
19. Unificar las 3 implementaciones independientes de "Cerrar sesión".
20. Agregar la rama `'ADMIN'` a la sincronización de rol en `service_locator.dart`.

### Prioridad baja
21. Unificar las dos implementaciones duplicadas de `GET /categories` y el `POST /quotes` duplicado.
22. Corregir la cámara del mapa de Home para centrarse en la ubicación real del usuario.
23. Hacer que el menú de Configuración consulte el backend en vez de una constante local.
24. Revisar y decidir el destino de `SelectRolePage` → "Continuar como Proveedor" para que verifique el estado real antes de navegar al shell de proveedor.

---

## VERIFICACIÓN TÉCNICA (re-ejecutada, sin regresiones)

| Comando | Resultado |
|---|---|
| `cd apps/backend && npx tsc --noEmit` | ✅ Limpio |
| `cd apps/backend && npm test` | ✅ 184 suites, 1114 tests, 0 fallos |
| `cd apps/backend && npm run build` | ✅ Limpio |
| `cd apps/backend && npm run test:e2e` | ✅ 23 suites, 312 tests, 0 fallos |
| `cd apps/mobile && flutter analyze` | ✅ 0 errores, 0 warnings, 78 `info` cosméticos |
| `cd apps/mobile && flutter test` | ✅ 885/885 |

**Nota importante:** estas 6 verificaciones en verde **no cubren ninguno de los 5 hallazgos bloqueantes** de este informe — ninguno tiene una prueba automatizada que lo detecte hoy (los tests unitarios/e2e usan datos y flujos que no ejercitan registro-sin-sesión, aprobación de proveedor, el DTO real de reseñas enviado por el móvil, la selección de conversación de chat, ni la subida de los dos tipos de documento en conflicto). Esto confirma que la suite de pruebas actual valida que el código hace lo que dice hacer aisladamente, pero no que los flujos completos funcionen de punta a punta para un usuario real — exactamente el vacío que esta auditoría funcional vino a cerrar.

---

*Fin del informe. No se realizó ningún cambio de código, commit, refactorización ni corrección durante esta auditoría.*
