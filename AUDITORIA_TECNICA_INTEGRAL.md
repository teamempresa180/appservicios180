# AUDITORÍA TÉCNICA INTEGRAL — APP SERVICIOS (SERVICIOS 180°)

**Fecha:** 2026-08-13
**Alcance:** Estado real del código en `main` (commit `28fda2d`), backend (NestJS/Prisma/MySQL, desplegado en Railway) + frontend (Flutter).
**Metodología:** 5 auditorías de solo lectura ejecutadas en paralelo sobre el código actual (arquitectura backend, arquitectura frontend, flujo cliente end-to-end, flujo proveedor end-to-end, seguridad e integración), más verificación directa de `flutter analyze`, `flutter test`, `tsc --noEmit`, `npm test`, `npm run build` y estado de Railway. **No se modificó ningún archivo.** Cada hallazgo cita `archivo:línea`. Donde no se pudo verificar en tiempo de ejecución (no se corrió la app), se marca explícitamente como "no verificado en runtime, inferido del código".

---

## 1. ARQUITECTURA

### Backend (`apps/backend`)
NestJS + Prisma + MySQL, Clean Architecture estricta: **no se encontró ningún controlador tocando Prisma directamente, ni ningún archivo de dominio/aplicación importando `@prisma/client`** — la separación de capas es real, no cosmética.

24 directorios en `src/modules/`: `address, attachment, audit, authentication, availability, category, chat, contact, core, credentials, identity, message, notification, order, payment, profiles, provider, quote, review, schedule, service, tracking, trust, verification`.

No existe módulo `specialization` separado — vive dentro de `category/` como segundo agregado.

Cada módulo (excepto `core` y `tracking`) sigue la misma estructura de 4 capas: `domain/{entities,interfaces,value-objects}` → `application/{commands,queries,dto,mappers,validators,use_cases}` → `infrastructure/persistence` → `presentation/{controllers,dto,routes,swagger}`.

No hay prefijo global de rutas (`setGlobalPrefix` no se usa) — todas las rutas son relativas a la raíz.

### Frontend (`apps/mobile`)
Flutter, arquitectura por features. 22 carpetas de entidades de dominio puro en `lib/<dominio>/` (sin UI ni repositorios) + 33 carpetas de features en `lib/features/<feature>/` (models, repos mock+http, view_models, pages, widgets) + `lib/core/` (DI, navegación, red, sesión, storage, tema, UI compartida).

**Navegación híbrida:** `go_router` (`core/navigation/router/app_router.dart`) solo gestiona 7 rutas estructurales (splash, onboarding, login, register, selectRole, home, becomeProvider) con guard basado en `SessionManager`. **Todo lo demás (37 pantallas de negocio) usa `Navigator.push(MaterialPageRoute)` manual, sin rutas nombradas ni deep links.**

**DI (`core/di/service_locator.dart`):** 30 interfaces de repositorio registradas, todas con patrón `ApiConfig.useMockBackend ? Mock... : Http...` **excepto una**: `TrackingRepository` está registrado **siempre en modo Mock**, sin implementación Http (línea 334) — el feature de tracking en vivo nunca podrá hablar con el backend real tal como está.

**Hallazgo crítico de configuración:** `ApiConfig.useMockBackend` **por defecto es `true`** (`core/network/api_config.dart:30-33`). Cualquier build sin `--dart-define=USE_MOCK_BACKEND=false` corre 100% desconectado del backend real, sin que la UI lo indique de ninguna forma.

### Qué está completo, parcial o inexistente

| Área | Estado |
|---|---|
| CRUD básico de las 23 entidades de dominio (backend) | **Completo** |
| Autenticación (JWT, refresh rotation, logout) | **Completo**, bien hecho |
| Autorización por rol/propiedad (backend) | **Inexistente** — ver Sección 7 |
| Wizard de registro profesional (5 pasos) | **Completo** funcionalmente, con datos derivados/hardcodeados menores |
| ProviderStatus (8 estados) | **Parcial** — routing exhaustivo en móvil, pero nada en el backend transiciona a `IN_REVIEW`; no existe panel admin para aprobar/rechazar |
| Ciclo de vida de Order (crear→aceptar→iniciar→completar→calificar) | **Parcial** — funciona, pero sin verificación de propiedad en el backend |
| Chat | **Roto** — ver Sección 4 |
| Tracking en tiempo real | **Inexistente** (stub de dominio únicamente, sin wiring) |
| Pagos | **Inexistente como funcionalidad** — solo tabla de bookkeeping, sin pasarela |
| Notificaciones push | **Inexistente** — solo filas en base de datos, sin FCM/APNs |
| Subida de archivos (verificación, avatar) | **Completo pero sin límites de tamaño** |
| Subida de adjuntos de chat | **Inexistente end-to-end** — el endpoint solo registra metadata, nunca sube bytes reales |

---

## 2. BACKEND — MÓDULO POR MÓDULO

Leyenda: **completo** = domain→presentation conectado y registrado en `AppModule`. **parcial** = conectado con vacíos materiales. **stub** = solo dominio.

| Módulo | Estado | Endpoints reales | Notas clave |
|---|---|---|---|
| **identity** | parcial | POST/PUT/DELETE/GET `:id` (sin lista ni búsqueda enrutadas) | `documentNumber` **no es único** en el schema (`schema.prisma:501`, solo índice) y `CreateIdentityUseCase` no valida duplicados — login usa `findFirst`. `ListIdentityUseCase`/`SearchIdentityUseCase` registrados pero sin ruta. |
| **credentials** | parcial | POST (público), PUT/DELETE/GET `:id` | `POST /credentials` es público, sin throttle propio, y no verifica si la Identity ya tiene una contraseña activa. **`ChangePasswordUseCase` existe, está probado, pero no tiene ruta HTTP — la API no permite cambiar contraseña.** |
| **authentication** | completo | register, login, refresh, logout, me, PUT/DELETE/GET `:id` | El módulo mejor endurecido: rotación de refresh token con detección de reuso, mensajes de error uniformes, algoritmo JWT fijado. |
| **profiles** | completo | CRUD + avatar upload | Sin verificación de propiedad — cualquier usuario autenticado puede editar/borrar el perfil de otro. `identityId` no es único — se pueden crear perfiles duplicados. |
| **address** | completo | CRUD + search | `GET /addresses` devuelve **todas** las direcciones de **todos** los usuarios a cualquier llamador autenticado. |
| **contact** | completo | CRUD + search | Mismo problema — `GET /contacts` expone email/teléfono de todos los usuarios. `value` nunca se valida contra `type` (un contacto "email" acepta cualquier texto). |
| **category** (+specialization) | completo | CRUD + search + specializations | Cualquier usuario autenticado (no solo admin) puede crear/renombrar/borrar categorías del marketplace. |
| **provider** | completo | CRUD + search + compatible | Cualquier usuario puede auto-aprobarse como `Active` vía `PUT /providers/:id` con `status` en el body. |
| **service** | completo | CRUD + search | Cualquier usuario puede editar/borrar el servicio publicado de otro proveedor. |
| **order** | completo (el más robusto) | CRUD parcial, cancel, start, complete, mine, relevant-for-provider, search | Único módulo con endpoints realmente escopados por usuario (`/mine`, `/relevant-for-provider`). Pero `cancel`/`start`/`complete` **no verifican quién llama** — cualquier autenticado puede avanzar/cancelar la orden de otro. |
| **quote** | completo | CRUD, accept, reject, search | Escritura no atómica Order+Quote en `accept-quote.use-case.ts` (dos writes separados, sin transacción). Rama de código muerta: `orderRepository` se declara opcional pero siempre se inyecta. |
| **payment** | completo | CRUD, cancel, search | Solo tabla de bookkeeping — no hay integración real con ninguna pasarela. `GET /payments` expone montos y partes de todos los pagos del sistema. Monto como `Float`. |
| **availability** | completo | CRUD + search | Móvil solo consume `GET` — todo el CRUD queda sin usar desde la app. Sin detección de solapamiento. |
| **schedule** | completo | CRUD + search | Duplicado casi exacto de `availability` a nivel de validador. Sin detección de solapamiento (doble reserva posible). |
| **verification** | completo | CRUD + search + upload de documento | **Combinación de mayor severidad del backend**: cualquier usuario puede auto-aprobar su propia verificación vía `PUT /verifications/:id`, y los documentos subidos (cédulas, selfies) se sirven sin autenticación desde `/uploads`. |
| **trust** | parcial | POST/PUT/GET/search (sin DELETE) | `score` sin ningún rango válido (acepta cualquier número) y puede ser fijado arbitrariamente por cualquier usuario. |
| **chat** | completo | POST, close, GET, search (sin DELETE) | `GET /chats` expone todos los chats del sistema. |
| **message** | completo | POST, DELETE, GET, search (sin PUT) | `GET /messages` expone **todos los mensajes privados entre todos los pares de usuarios** a cualquier autenticado. Sin verificación de que el remitente sea participante del chat. |
| **notification** | completo | CRUD + read + search | No hay ningún mecanismo real de entrega (push/email) — son solo filas en BD. `PUT /:id/read` existe pero el móvil nunca lo llama. |
| **attachment** | parcial | POST, DELETE, GET, search (sin PUT) | **No hay subida de archivo real** — `POST /attachments` solo registra metadata (nombre, tipo, tamaño) declarada por el cliente, sin recibir bytes. Los adjuntos de chat no funcionan end-to-end. |
| **review** | completo | CRUD + search | **`rating` no tiene ningún rango validado** — acepta `1000000` o `-5`. Sin regla de una reseña por orden (documentado como intencional) — un usuario puede spamear reseñas ilimitadas con calificación arbitraria. |
| **audit** | parcial | POST, GET, search (sin PUT/DELETE) | **Nada en el backend escribe registros de auditoría automáticamente** — el log de auditoría es 100% suministrado por el cliente y por tanto falsificable. Ningún evento de login/cambio de permiso se registra server-side. |
| **tracking** | **stub** | Ninguno | Solo 4 archivos de dominio puro. **Sin capa de aplicación, infraestructura ni presentación. Sin controlador, sin modelo Prisma, no está registrado en `AppModule`.** Código muerto en el build. |

### Preocupaciones transversales

- **No hay `ValidationPipe` global ni `class-validator` instalado en el proyecto.** Toda la validación es manual dentro de cada `*.validator.ts`. Solo 2 de 23 validadores (`auth-session.validator.ts`, `credential.validator.ts`) verifican longitud máxima; los otros 21 no tienen ningún tope de longitud.
- **Patrón de validación débil generalizado:** 21 de 23 validadores usan `!command.field?.trim()`, que no atrapa un número/array/objeto JSON en ese campo — un body como `{"fullName": 123}` puede provocar un `TypeError` no controlado → 500 genérico en vez de 400 claro (no verificado en runtime, alto grado de confianza por lectura de código).
- **Documentación desactualizada:** el schema usa MySQL, pero el Swagger, la URL por defecto de desarrollo y varios comentarios de repositorio dicen "PostgreSQL" — inconsistencia inofensiva pero confusa.
- **Ningún `String` en el schema tiene `@db.VarChar`/`@db.Text` explícito** → todos son `varchar(191)` por defecto de MySQL. Combinado con la falta de validación de longitud, cualquier texto largo (un mensaje de chat, un comentario de reseña) puede fallar a nivel de driver con un 500 (no verificado en runtime).
- **19 endpoints `/search` sin índice utilizable** — todos son `LIKE '%term%'` sobre columnas sin índice FULLTEXT, full table scan acotado solo por `take: 200`. El móvil **no llama a ninguno de estos 19 endpoints** — es superficie muerta y además la más cara del sistema.
- **Cero transacciones de base de datos** en todo el proyecto (`$transaction` no aparece ni una vez).
- **Cero N+1 en el backend** — usa `Promise.all` correctamente. El patrón N+1 que existe está **en el cliente móvil** (ver Sección 9).
- Índices bien pensados para las consultas calientes reales (feed de solicitudes abiertas, matching de proveedor, refresh token hash, "mis órdenes") — trabajo sólido de la última etapa de rendimiento.
- **IDs generados con `Math.random()`**, no `crypto.randomUUID` (que ya se usa en otra parte del mismo código) — relevante porque `main.ts` justifica servir `/uploads` sin autenticación asumiendo que la ruta "nunca es enumerable".
- **39 DTOs de aplicación huérfanos** (uno por módulo, nunca importados — superados por las clases `*.command.ts`) — el bloque de código muerto más grande del repositorio.
- **7 casos de uso registrados en DI pero sin ruta HTTP**, incluyendo el cambio de contraseña completo.
- Grep de `TODO|FIXME|HACK|XXX|@deprecated` en `apps/backend/src`: **0 resultados.** (La deuda existe, pero está documentada en comentarios de prosa, no en marcadores — cualquier conteo automático de TODOs reportará cero y estará equivocado.)

---

## 3. FRONTEND — PANTALLA POR PANTALLA

37 páginas bajo `features/*/presentation/pages/`. Todas siguen el mismo patrón de inyección opcional de repositorio, por lo que **todas respetan el toggle Mock/Http real** salvo 3 excepciones confirmadas:

### Pantallas con datos falsos confirmados
| Pantalla | Hallazgo |
|---|---|
| **Home del proveedor** (`features/home/presentation/widgets/provider_home_content.dart:36-39`) | Estadísticas **hardcodeadas y presentadas como reales**: pedidos pendientes = 3, servicios publicados = 5, calificación = 4.8, disponibilidad = true (`mock_home_data.dart:26-29`). **No depende de `useMockBackend` — es falso en cualquier build.** Es el hallazgo de datos falsos de mayor severidad de todo el proyecto. |
| **Home (cliente y proveedor)** (`home_header.dart:35`) | El saludo usa un nombre fijo (`'María'`/`'Carlos'`) en vez del nombre real de la sesión — también fuera del toggle mock. |
| **Tracking** (`order_tracking_page.dart`) | Siempre usa `MockTrackingRepository`, sin implementación Http registrada (ver Sección 1). Además, la pantalla **no tiene ningún punto de entrada en la navegación** — es inalcanzable. |

### Botones muertos silenciosos confirmados
| Ubicación | Hallazgo | Severidad |
|---|---|---|
| `notifications/presentation/widgets/notification_actions.dart:19` + `notification_card.dart:52` | El callback nunca se pasa desde el sitio de uso real → **el botón de acción de cada notificación no hace nada**, sin feedback. | Alta |
| `reviews/presentation/widgets/review_actions.dart:19` + `review_card.dart:46` | Mismo patrón → "Editar"/"Ver detalle" de una reseña no hacen nada. | Alta |

### Botones "Próximamente" honestos (no rotos, solo incompletos)
- Adjuntar fotos en solicitud de servicio (`attachments_section.dart:49`)
- Pagar / reintentar pago (`payment_actions.dart:59`)
- Editar horario/disponibilidad — reemplazado deliberadamente por una nota explicativa (Etapa 17)
- Acciones de verificación — misma nota explicativa

### Pantallas inalcanzables desde la navegación (huérfanas)
- `features/payments/presentation/pages/payments_page.dart` — **todo el feature de Pagos es inalcanzable desde la UI**, solo referenciado en tests.
- `features/tracking/presentation/pages/order_tracking_page.dart` — sin ninguna referencia, ni en tests.
- `features/search/presentation/pages/search_page.dart` y `features/categories/presentation/pages/categories_page.dart` — la funcionalidad sobrevive embebida en Marketplace, pero la pantalla standalone no se usa.

### Código muerto confirmado (68 archivos nunca importados)
- **Capa completa `datasources/` (46 archivos)**: cada feature con carpeta `datasources/` tiene su `*_local_data_source.dart` y `*_remote_data_source.dart` sin usar — los repositorios hablan directo con `ApiClient`. Aparenta una arquitectura en capas que no existe realmente.
- **5-6 DTOs huérfanos** en `profile`, `provider_dashboard`, `security`, `settings`, `trust`, `verification`.
- **9 widgets huérfanos**: estados de carga/vacío duplicados en varios features, `recent_services.dart`.
- 2 utilidades core sin usar (`spacing_extensions.dart`, `app_image_size.dart`).

### `flutter analyze` (verificado hoy)
```
78 issues found — 0 errores, 0 warnings, 78 info.
```
- 73× `prefer_initializing_formals` — un solo patrón de DI repetido en casi cada página/view-model, cosmético.
- 4× `use_null_aware_elements` — cosmético.
- 1× `unintended_html_in_doc_comment` — cosmético.

Grep de `TODO|FIXME|HACK|XXX|@deprecated` en `lib/`: **0 resultados** en todo el árbol. La narrativa de deuda vive en los `README.md` de cada feature — y **varios están desactualizados** respecto al código real (p. ej. el README de chat todavía dice que el botón de enviar es un no-op; ya no lo es).

`flutter pub outdated`: 33 paquetes con versión más nueva disponible, incluyendo `go_router` (14.8.1→17.5.0), `flutter_secure_storage` (9.2.4→11.0.0), `geolocator`, `get_it` — vale la pena revisar antes de una v1.0 pública.

---

## 4. FLUJO CLIENTE — TRAZA COMPLETA

**Nota global:** cada verificación de "Http-backed" solo aplica a un build con `--dart-define=USE_MOCK_BACKEND=false`. No verificado en runtime (no se ejecutó la app); todo lo siguiente es del código fuente.

| Paso | Veredicto | Hallazgo |
|---|---|---|
| **Registro** | PARTIAL | 4 llamadas secuenciales no transaccionales (Identity→Credential→Auth→Profile). Si falla un paso intermedio, la Identity ya existe y un reintento con el mismo documento falla con "ya registrado", dejando una cuenta huérfana sin credencial utilizable. Sin captura de email/teléfono para contacto/recuperación. |
| **Login** | OK | Estados de carga/error bien manejados, incluyendo 401/429/conectividad. Banner de "sesión expirada" tras redirect del guard. |
| **Home** | PARTIAL | El mapa muestra un marcador de ubicación real, pero la **cámara está fija en un punto hardcodeado de Bogotá** (`LatLng(4.7110, -74.0721)`), independiente de la ubicación real del usuario. Categorías rápidas: fallo silencioso total (catch vacío) si el backend falla. |
| **Buscar servicio** | PARTIAL | **No usa el endpoint real `GET /services/search`** — trae la página 1 (20 resultados) sin filtro y filtra en el cliente. Con más de 20 servicios en catálogo, la búsqueda deja de encontrar resultados reales. Las calificaciones mostradas por proveedor se calculan sobre una lista de reseñas sin filtrar y truncada a 20 — quedan incorrectas con datos reales. |
| **Seleccionar proveedor** | OK, con un detalle | El botón "Solicitar servicio" no da ningún feedback si el proveedor no tiene servicios o categoría resolubles — no es un error visible, simplemente no pasa nada. |
| **Crear solicitud** | PARTIAL — **bug de integridad de datos confirmado** | `getAddress()` llama `GET /addresses` y devuelve **la primera dirección de la tabla completa, sin filtrar por el usuario de la sesión** (`http_request_service_repository.dart:31-38`) — a diferencia de `AddressManagementRepository`, que sí filtra. En un backend con más de un usuario, **la orden puede crearse contra la dirección de otra persona.** No existe selector de dirección aunque el cliente tenga varias guardadas. Sin validación server-side de la fecha (`class-validator` ausente). |
| **Cotización** | PARTIAL | Trae **todas las cotizaciones del sistema sin filtro** y filtra por `orderId` en el cliente, capado a 20 — pasado ese límite, una cotización real del usuario puede desaparecer silenciosamente (pantalla "Esperando cotizaciones" indistinguible de un estado vacío real). Sin botón de refrescar ni polling. |
| **Aceptar → Chat** | **BROKEN** | `ChatPage` **no recibe ningún identificador de chat** — internamente resuelve "el primer chat de la lista global sin filtrar" (`http_chat_repository.dart:37-44`). Aceptar una cotización crea/obtiene el chat correcto pero **abre uno distinto**. La lista de conversaciones es real, pero tocar cualquier fila abre siempre el mismo chat. Documentado en el propio código como limitación conocida — pero es una ruptura funcional real, no cosmética. |
| **Servicio en curso** | MISSING (tracking) | El cliente solo puede abrir el chat mientras el servicio está en curso. La pantalla de tracking en vivo existe en código pero es inalcanzable y siempre mock (ver Secciones 1 y 3). |
| **Finalizar** | OK (por diseño) | Solo el proveedor puede finalizar. El cliente no tiene forma de disputar una finalización falsa — su única acción posterior es calificar. |
| **Calificar** | OK | Validación de rating (nunca 0), comentario 5-500 caracteres, guard de sesión expirada con mensaje específico. El estado de moderación (`'PUBLISHED'`) se fija hardcodeado en el cliente, no lo decide el servidor. |

**Hallazgo transversal más grave del flujo cliente:** las listas `GET /addresses`, `/chats`, `/quotes`, `/messages`, `/reviews`, `/profiles`, `/contacts` están **protegidas solo por JWT válido, sin ningún filtro por usuario** en el backend — cualquier usuario autenticado puede leer los datos de cualquier otro. El único endpoint correctamente escopado es `/orders/mine`.

---

## 5. FLUJO PROVEEDOR — TRAZA COMPLETA

| Paso | Veredicto | Hallazgo |
|---|---|---|
| **Registro (cliente)** | **BROKEN** | `POST /identities` es público, pero el 4º paso (`POST /profiles`) requiere JWT y se ejecuta **antes de tener sesión iniciada** → **401 en un dispositivo nuevo**. Se crea Identity/Credential/Auth pero no Profile. Parcialmente enmascarado porque `become_provider` crea el perfil faltante más adelante — pero el registro base, tal como está escrito, no completa su propio flujo. |
| **Wizard "Convertirse en proveedor"** (5 pasos) | PARTIAL, mayormente real | Info personal, especialización y documentación (7 tipos reales) funcionan end-to-end contra endpoints reales. "Experiencia previa" se concatena como texto libre dentro de la biografía (no existe columna dedicada en el backend) y el nivel de experiencia se **deriva** de los años, nunca se pregunta directamente. El resumen final muestra un contador de "documentos subidos" que es **el número requerido, no el estado medido** — correcto hoy porque el paso 4 lo garantiza, pero es un número fabricado, no verificado. |
| **Verificación de documentos** | PARTIAL | La subida real de documentos ocurre en el wizard. La pantalla separada `features/verification` **no tiene relación con el flujo de Verification real** — su contrato solo trae Identity+Profile, sin ningún dato de verificación; su barra de acciones es solo un texto explicativo. |
| **Aprobación (ProviderStatus)** | PARTIAL | El switch de routing es exhaustivo en ambos lugares (wizard y dashboard) para los 8 estados. **Pero nada en el backend transiciona nunca a `IN_REVIEW`** — no existe panel de administración ni rol staff; cada cambio de estado requiere una llamada manual a la API. Cuando es `Rejected`, el motivo **no se puede mostrar** porque no existe el campo en el backend — solo se listan qué documentos fueron rechazados. Inconsistencia: la vista del dashboard para `rejected` no ofrece reenvío (solo "Contacta a soporte"), a diferencia de la vista del wizard que sí lo permite. |
| **Dashboard** | OK — datos falsos ya corregidos | Las métricas de tiempo de respuesta y tasa de aceptación fabricadas **ya fueron eliminadas/corregidas en la Etapa 17** (tasa de aceptación ahora es `null` hasta tener datos reales; tiempo de respuesta se eliminó por completo). Ingresos calculados solo sobre pagos realmente completados. Persisten filtrados client-side sin endpoint `?providerId=` en el backend. |
| **Servicios** | OK | CRUD completo y real (crear/editar/pausar/eliminar), todos conectados a endpoints reales. |
| **Solicitudes** | **BROKEN — bug de severidad alta confirmado** | El botón **"Rechazar solicitud" del proveedor llama al mismo endpoint que "Cancelar orden" del cliente** (`PUT /orders/:id/cancel`), y ese caso de uso **no verifica propiedad ni estado previo**. Un proveedor que "rechaza" una solicitud abierta (sin asignar) en su categoría **cancela la orden completa del cliente para todos los demás proveedores**, aunque la UI la presente como una acción individual e irreversible. |
| **Cotización** | OK | `POST /quotes` con campos reales, endpoint existe. Filtrado client-side sin endpoint de filtro server-side. |
| **Aceptar trabajo** | OK por diseño | No existe "aceptar" del lado proveedor — el flujo avanza solo cuando el cliente acepta la cotización, correctamente vía `PUT /quotes/:id/accept`. |
| **Iniciar / Finalizar** | PARTIAL | Ambos endpoints existen y verifican el estado correcto de la orden (`Accepted`→start, `InProgress`→complete), pero **ninguno verifica que quien llama sea el proveedor asignado** — cualquier usuario autenticado puede iniciar o completar la orden de cualquier otro. |
| **Reseñas recibidas** | **BROKEN** | `GET /reviews` sin ningún filtro, y la vista de "reseñas recibidas" del proveedor **muestra todas las reseñas del sistema, de todos los proveedores** — no solo las propias. |
| **Agenda/Disponibilidad** | PARTIAL, de solo lectura por diseño | El backend tiene CRUD completo (`POST/PUT/DELETE`), pero el móvil solo expone lectura — la edición fue reemplazada por una nota "por ahora se configura con nuestro equipo" (decisión deliberada de la Etapa 17, no un bug). |

---

## 6. INTEGRACIÓN

| Enlace | Estado | Evidencia |
|---|---|---|
| Flutter → Backend (config) | **PARTIAL** | Sin IPs hardcodeadas en Dart. Pero `useMockBackend` por defecto es `true` — el mayor riesgo operativo de toda la integración: un APK compilado sin el flag correcto nunca toca Railway. Queda además una IP de LAN de desarrollo (`192.168.10.11`) en `network_security_config.xml` — inofensiva (solo habilita cleartext hacia esa IP específica, no afecta el tráfico HTTPS a Railway) pero debería limpiarse. |
| Backend → Railway | **OK** | `railway.json` + `package.json` corrigen correctamente el bug histórico de `dist/main` (Etapa 12) — confirmado que sigue arreglado. |
| Backend → MySQL | **OK** | `DATABASE_URL` 100% por variable de entorno, sin credenciales en código. |
| Google Maps | **OK** | La clave se inyecta desde `secrets.properties`, que está correctamente en `.gitignore` y **no está commiteada**. |
| JWT end-to-end (móvil) | **OK** | Cadena coherente: secure storage → SessionManager → AuthInterceptor → RefreshInterceptor con refresco single-flight (correcto, dado que el refresh token es de un solo uso). |
| Subida de archivos end-to-end | **PARTIAL (funcional pero operativamente roto en Railway)** | El flujo de subida y recuperación de documentos de verificación funciona completo. **Pero el almacenamiento es el disco local del contenedor**, sin volumen declarado en `railway.json` — **cada redeploy borra todos los documentos subidos**, dejando las filas de la base de datos apuntando a rutas que ya no existen. Esto rompe la revisión de verificación después de cualquier despliegue. |
| Roles end-to-end | **PARTIAL** | El backend calcula el rol correctamente en login/refresh y el móvil lo sincroniza bien — pero, dado que el backend no aplica ningún control de rol en los endpoints (Sección 7), todo el modelo de roles es **solo una señal de UI**, no una barrera de seguridad real. |

### Sondeo de secretos comprometidos: **LIMPIO**
Se verificó que no hay ninguna clave de API, contraseña de base de datos ni secreto JWT en archivos rastreados por git. `.env`, `secrets.properties`, `key.properties` y `upload-keystore.jks` están correctamente ignorados.

---

## 7. SEGURIDAD

### CRÍTICO

**S1 — `RolesGuard` está implementado, probado, pero nunca aplicado a ningún endpoint.** Cero usos de `@Roles(...)` o `RolesGuard` fuera de `common/auth/`. Todos los 23 controladores usan solo `@UseGuards(JwtAuthGuard)`. **Consecuencia: el claim `role` del JWT es decorativo — cualquier usuario autenticado como Cliente puede llamar cualquier endpoint "solo para proveedores".**

**S2 — `POST /credentials` público permite apropiación de cuenta.** Sin guard, sin verificación de que la Identity ya tenga una credencial activa, sin throttle propio. Un atacante que conozca o enumere el UUID de cualquier Identity puede adjuntarle su propia contraseña. `LoginUseCase` toma la primera credencial activa que coincide — el orden no es determinista, por lo que la apropiación es al menos intermitente y en el peor caso confiable.

**S3 — Auto-aprobación a Provider vía `PUT /providers/:id`.** Cualquier usuario autenticado puede poner `status: ACTIVE` en su propio registro de Provider (o el de cualquier otro) y luego refrescar su token para obtener el rol Proveedor real. No existe ningún rol Admin emitido en el sistema — `Role.Admin` está definido pero nunca se otorga.

**S4 — Sin verificación de propiedad en casi ningún recurso (IDOR masivo).** Solo 3 endpoints en toda la API derivan el sujeto del token (`@CurrentUser()`): `/authentications/me`, `/orders/mine`, `/orders/relevant-for-provider`. Todo lo demás toma un `:id` de la URL sin comprobar que pertenezca al llamador — `DELETE /identities/:id` permite a cualquier usuario logueado borrar cualquier cuenta.

### ALTO

**S5 — El estado del proveedor solo se verifica al emitir el token, nunca en cada request.** Un proveedor suspendido/bloqueado a mitad de sesión conserva el rol Proveedor hasta que su access token expire (900 segundos).

**S6 — Sin `ValidationPipe` global; validación manual e inconsistente** (detallado en Sección 2).

**S7 — Subidas de archivo sin límite de tamaño y con tipo verificable por el cliente.** Ningún `FileInterceptor` tiene `limits.fileSize` — el archivo completo se buffea en memoria del proceso. El tipo MIME se toma del `Content-Type` que declara el propio cliente, sin inspección de bytes mágicos.

**S8 — `/uploads` se sirve públicamente, sin autenticación**, protegido solo por rutas que incluyen IDs generados con `Math.random()` (no criptográficamente seguro) y, en el caso de documentos de verificación, **el nombre de archivo original del usuario** (`cedula.pdf`, `selfie.jpg`) — mucho más adivinable de lo que asume el comentario que justifica la decisión. Combinado con S4 (`GET /verifications` abierto), un documento de identidad real es alcanzable.

### MEDIO

**S9 — CORS por defecto es `*`.** Impacto práctico bajo (auth por Bearer token, no cookies), pero combinado con Swagger público en `/docs` reduce la barrera de explotación.

**S10 — Sin `helmet`.** Solo 3 headers manuales; faltan HSTS, CSP y otros — decisión documentada como fuera de alcance.

**S11 — Vacíos en rate limiting.** `POST /credentials` (el vector de S2), y ambos endpoints de subida de archivos, no tienen throttle propio más allá del límite global de 100/min/IP.

### BAJO / CORRECTO (para que quede constancia de lo que sí está bien hecho)
- **Configuración JWT: correcta.** Secretos solo por variable de entorno, sin ningún literal hardcodeado, algoritmo fijado a `HS256`, issuer+audience verificados, expiración de 900s (access) / 7 días (refresh).
- **Rotación de refresh token: correctamente implementada**, incluyendo detección de reuso que revoca toda la familia de sesiones.
- **Logout: revoca el token en el servidor**, no solo limpia almacenamiento local.
- **Respuestas de error: correctas** — nunca filtran stack traces ni mensajes internos de Prisma al cliente.
- **Contraseñas:** hasheadas con bcrypt, nunca en texto plano.
- **Sin secretos commiteados en el repositorio** (verificado exhaustivamente).

---

## 8. CALIDAD

- **Backend:** 0 resultados de `TODO|FIXME|HACK|XXX|@deprecated`. Deuda documentada en comentarios de prosa, no en marcadores. 39 DTOs huérfanos, 7 casos de uso sin ruta, módulo `tracking` completo como código muerto, puerto de observabilidad sin ningún consumidor, guard de roles sin ningún uso.
- **Frontend:** 0 resultados de `TODO|FIXME|HACK|XXX|@deprecated`. 68 archivos nunca importados (46 de ellos forman una capa `datasources/` completa que no se usa en ningún lado). Varios `README.md` de features desactualizados respecto al código real.
- **Código duplicado detectado:** los validadores de `availability` y `schedule` son casi copias literales entre sí.
- **Sin imports innecesarios ni widgets/servicios obviamente sin usar** más allá de lo ya listado — no se encontró un problema sistémico de imports muertos.

---

## 9. RENDIMIENTO

- **Backend:** sin problema de N+1 — usa `Promise.all` correctamente. Índices compuestos bien alineados a las 3 consultas más calientes reales (feed de solicitudes abiertas, matching de proveedor, "mis órdenes"), trabajo de la Etapa 17. Las 19 búsquedas `LIKE '%…%'` sin índice utilizable son caras pero **no las usa el móvil**, así que su impacto real hoy es nulo — es deuda latente, no un problema activo.
- **Frontend (el N+1 real del sistema vive aquí):**
  - Chat: 5 llamadas HTTP separadas por cada chat cargado (`http_chat_repository.dart`).
  - Cotizaciones: 3 requests por fila de cotización en vez de 2 (`getProfileFor` vuelve a llamar internamente a `getProviderFor`, que el view-model ya había llamado).
  - Búsqueda: obtiene la lista completa de reseñas del sistema (capada a 20) por cada proveedor para calcular su calificación.
  - Patrón repetido: varias pantallas traen la lista **completa sin filtro** de un recurso (chats, cotizaciones, direcciones, mensajes) y filtran en el cliente — esto no es solo ineficiente, es la misma causa raíz de los bugs de scoping de seguridad de la Sección 7.
- **Sin problema de rebuilds/widgets costosos identificado como sistémico** en esta pasada — no se encontró evidencia de listas mal optimizadas fuera de lo ya cubierto por la Etapa 17.

---

## 10. PRUEBAS Y VERIFICACIÓN (ejecutado hoy, resultados reales)

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` (backend) | ✅ Sin errores |
| `npm test` (backend) | ✅ 184/184 suites, 955/955 tests |
| `npm run build` (backend) | ✅ Sin errores |
| `flutter analyze` | ✅ 0 errores, 0 warnings, 78 info (cosmético) |
| `flutter test` | ✅ 885/885 tests |
| Railway (estado del servicio) | ✅ Online |
| Railway (verificación HTTP real) | ✅ `GET /docs` → `HTTP 200` |
| APK | No se generó (instrucción explícita del usuario: solo auditoría, sin build) |

**Todo pasa.** Esto confirma que el código está internamente consistente y libre de regresiones — pero, como muestra el resto de este informe, "todos los tests pasan" **no implica que el sistema sea seguro ni que los flujos de negocio sean correctos frente a más de un usuario real**, porque casi ninguno de los bugs de scoping/autorización encontrados tiene un test que lo cubra (los tests existentes usan datos de un solo usuario/mock determinista).

---

## PENDIENTES PARA LA VERSIÓN 1.0

### 🔴 CRÍTICO — bloquea cualquier piloto con más de un usuario real

1. **Aplicar `RolesGuard` + `@Roles()` a todos los endpoints "solo proveedor"/"solo cliente".** Hoy el rol del JWT es decorativo — cualquier cliente puede ejecutar acciones de proveedor. Sin esto, no hay separación de roles real.
2. **Agregar verificación de propiedad (`@CurrentUser()` + comparación de ID) a todo endpoint que opera sobre un recurso de otro usuario** — direcciones, contactos, perfiles, verificaciones, pagos, mensajes, chats, cancelar/iniciar/completar orden. Hoy cualquier usuario autenticado puede leer o modificar los datos de cualquier otro.
3. **Cerrar la apropiación de cuenta vía `POST /credentials`** — requerir autenticación o invalidar si la Identity ya tiene contraseña activa.
4. **Quitar la capacidad de auto-aprobación** vía `PUT /providers/:id`, `PUT /verifications/:id`, `PUT /trust-profiles/:id` — el campo `status`/`score` no debe ser modificable por el usuario común; requiere un flujo administrativo real (que hoy no existe en absoluto).
5. **Arreglar el bug de "Rechazar solicitud" del proveedor** — hoy cancela la orden completa del cliente en vez de simplemente retirar a ese proveedor de la consideración.
6. **Arreglar el chat sin dirección (`ChatPage` sin id)** — hoy siempre abre "el primer chat de la lista", no el chat correcto. Esto rompe la comunicación cliente-proveedor en cualquier cuenta con más de una conversación.
7. **Arreglar "reseñas recibidas" del proveedor** — hoy muestra las reseñas de todos los proveedores del sistema.
8. **Arreglar la selección de dirección al crear una solicitud** — hoy toma la primera dirección de la tabla completa sin filtrar por usuario; una orden puede crearse contra la dirección de otra persona.
9. **Almacenamiento persistente para archivos subidos (verificación, avatares).** Hoy vive en el disco local del contenedor de Railway y se borra en cada despliegue, dejando enlaces rotos. Requiere un volumen persistente o almacenamiento de objetos (S3 o equivalente).
10. **Cambiar el valor por defecto de `USE_MOCK_BACKEND` o, como mínimo, dejarlo explícito y visible en cada build de release** — el riesgo de distribuir por error un APK 100% desconectado del backend real es alto y silencioso.

### 🟠 ALTO — necesario para que el producto se sienta confiable con datos reales

11. **Reemplazar el Home del proveedor** — las estadísticas (pedidos pendientes, servicios, calificación) y el nombre de saludo están hardcodeados y no reflejan al usuario real, en cualquier build.
12. **Agregar `class-validator`/`ValidationPipe` global**, o como mínimo aplicar el patrón fuerte de `auth-session.validator.ts` (chequeo de tipo + longitud máxima) a los 21 validadores restantes — hoy la mayoría de los endpoints puede devolver un 500 genérico ante datos malformados en vez de un 400 claro.
13. **Agregar rango válido a `rating` (reseñas) y a `trust.score`** — hoy aceptan cualquier número, incluyendo negativos o absurdamente altos.
14. **Conectar el botón de acción de notificaciones y reseñas** — hoy son silenciosamente no-op (el callback nunca se pasa desde el sitio de uso real).
15. **Arreglar el registro del proveedor (paso 4, `POST /profiles`)** que falla con 401 en una cuenta recién creada por ejecutarse antes de tener sesión — hoy queda parcialmente enmascarado porque el wizard de "convertirse en proveedor" crea el perfil faltante después, pero el registro base no completa su propio flujo.
16. **Definir cómo se llega realmente a `ProviderStatus.IN_REVIEW` y cómo se aprueba/rechaza a un proveedor** — hoy no existe ningún mecanismo (panel admin, rol staff, o proceso) para mover a un proveedor de Pending a Active salvo llamar la API manualmente. Sin esto, el pipeline de aprobación no es operable en producción.
17. **Mostrar el motivo real de rechazo** — no existe el campo en el backend; hoy solo se puede indicar qué documentos fueron rechazados, no por qué.
18. **Agregar límite de tamaño y validación de contenido real (no solo `Content-Type` declarado) a las subidas de archivo.**
19. **Habilitar la transaccionalidad en operaciones multi-entidad** — como mínimo `AcceptQuoteUseCase` (Order + Quote deben cambiar juntos o no cambiar).
20. **Decidir si el feature de Pagos se termina o se retira** — hoy es una tabla de bookkeeping sin pasarela real, con una pantalla inalcanzable desde la navegación y botones "próximamente".

### 🟡 MEDIO — pulido y robustez antes de escalar el piloto

21. **Filtrar del lado del servidor las listas hoy globales** (`/addresses`, `/chats`, `/quotes`, `/messages`, `/reviews`, `/contacts`, `/payments`, `/audit-records`) en vez de depender del filtrado client-side truncado a 20-200 filas — esto es a la vez el problema de seguridad de la Sección 7 y el problema de rendimiento/correctness de la Sección 9 (datos que "desaparecen" silenciosamente pasado el límite).
22. **Usar el endpoint real de búsqueda** (`GET /services/search`) en vez de filtrar client-side sobre la primera página.
23. **Eliminar la capa `datasources/` sin usar (46 archivos)** y los 39 DTOs de aplicación huérfanos del backend, o documentar explícitamente por qué se mantienen.
24. **Registrar auditoría real server-side** (login, cambios de estado de proveedor, cambios de rol) — hoy el log de auditoría es 100% suministrado por el cliente y por tanto no confiable como evidencia.
25. **Agregar la ruta HTTP para `ChangePasswordUseCase`** — el caso de uso existe y está probado, pero la API no tiene forma de invocarlo.
26. **Revisar y actualizar los `README.md` de features desactualizados** (al menos el de chat, que describe un comportamiento ya corregido).
27. **Corregir la posición fija del mapa en Home** (hoy centrado en un punto fijo de Bogotá en vez de la ubicación real del usuario).
28. **Agregar endpoint de salud (`/health`)** para que Railway (o cualquier orquestador) pueda verificar el estado real del servicio más allá de un 200 en la raíz.
29. **Actualizar las 33 dependencias de Flutter desactualizadas**, priorizando `flutter_secure_storage` y `geolocator` por su relación con seguridad/permisos.

### 🟢 BAJO — no bloquea el piloto, pero vale la pena antes de una v1.0 pública

30. Corregir la inconsistencia de documentación MySQL/PostgreSQL en Swagger, comentarios y URL de desarrollo por defecto.
31. Agregar `helmet` y cabeceras de seguridad adicionales (HSTS, CSP).
32. Restringir CORS a los orígenes reales en vez de `*`.
33. Ocultar Swagger (`/docs`) en producción o protegerlo con autenticación.
34. Eliminar el módulo `tracking` (stub sin wiring) o completarlo como una etapa futura explícita — hoy es código muerto que confunde el inventario real de funcionalidades.
35. Limpiar la IP de LAN de desarrollo remanente en `network_security_config.xml`.
36. Completar la subida real de adjuntos en chat (hoy solo se registra metadata declarada por el cliente, sin bytes reales).
37. Decidir el destino del feature de Tracking en tiempo real: hoy tiene entidades de dominio completas en ambos lados pero cero wiring — o se retira del inventario visible o se planea como etapa futura real (ya excluido explícitamente de esta etapa por instrucción del usuario).

---

*Fin del informe. No se realizó ningún cambio de código, commit, despliegue ni build durante esta auditoría.*
