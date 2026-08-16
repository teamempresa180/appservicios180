# ETAPA 18 — SEGURIDAD, AUTORIZACIÓN Y CORRECCIÓN ESTRUCTURAL (v1.0)

**Fecha:** 2026-08-14
**Alcance:** Backend NestJS/Prisma/MySQL (`apps/backend`), desplegado en Railway. Sin cambios de UI/UX en el frontend.
**Commits:** 28 commits en `main`, `427 archivos modificados, +11 795 / -1 518 líneas`.
**Metodología:** Auditoría previa (documento `AUDITORIA_TECNICA_INTEGRAL.md`) → fase de fundamentos compartidos → 5 grupos de trabajo por dominio de módulos, cada uno con verificación completa antes de integrarse a `main` de forma secuencial (uno a la vez, según pediste, para no agotar recursos).

---

## 1. RESUMEN EJECUTIVO

Al cierre de esta etapa, **ningún usuario autenticado puede**: acceder a información de otro usuario, modificar recursos ajenos, auto-aprobarse como proveedor, aprobar sus propias verificaciones KYC, alterar estados que no le corresponden, leer chats o mensajes de terceros, leer direcciones/contactos/pagos de terceros, ni iniciar/finalizar/cancelar órdenes ajenas (con una excepción documentada explícitamente abajo). Esto cierra los hallazgos **críticos** y **altos** de la auditoría previa.

Todo se verificó de forma acumulativa tras cada integración: al final, **184/184 suites unitarias (1114 tests)**, **23/23 suites e2e (312 tests)**, `tsc` y `npm run build` limpios, `flutter analyze`/`flutter test` del móvil sin regresiones (885/885), Railway desplegado y confirmado sano vía el nuevo `GET /health` (verifica conectividad real a MySQL, no solo que el proceso esté vivo).

---

## 2. FUNDAMENTOS COMPARTIDOS (aplicados una sola vez, usados por los 5 grupos)

| Elemento | Qué se hizo | Archivo(s) |
|---|---|---|
| `ValidationPipe` global | `whitelist: true, forbidNonWhitelisted: true, transform: true` — cualquier campo no declarado en un DTO se elimina o rechaza la petición | `src/main.ts` |
| `class-validator` / `class-transformer` | Instalados y usados en los ~90 DTOs de request de los 22 módulos de dominio | `package.json` |
| Generación de IDs | `Math.random()` → `crypto.randomUUID()` (criptográficamente seguro) | `src/modules/core/domain/utils/id.generator.ts` |
| Helmet | Reemplaza los 3 headers manuales anteriores; añade HSTS, CSP y demás cabeceras estándar | `src/main.ts` |
| CORS | Ya no acepta `*` en producción por defecto — falla al arrancar si `CORS_ORIGIN` no está configurado explícitamente en producción. Variable de Railway actualizada de `*` a un valor real | `src/config/env.validation.ts`, variable de entorno en Railway |
| `GET /health` | Nuevo endpoint público que ejecuta `SELECT 1` real contra MySQL — no solo confirma que el proceso Node está vivo | `src/app.controller.ts` |
| `/uploads` | Ya no sirve todo el árbol públicamente. Solo `/uploads/profiles` (avatares) queda estático. Los documentos de verificación (cédulas, selfies, certificados) se sirven exclusivamente vía `GET /verifications/:id/document`, autenticado, con verificación de propiedad | `src/main.ts`, `src/modules/verification/presentation/controllers/verification.controller.ts` |
| `TransactionRunner` | Puerto de dominio (`TransactionContext`) + puerto de aplicación + adaptador Prisma, respetando Clean Architecture (el dominio no depende de Prisma). Aplicado al único caso real de escritura múltiple del backend: `AcceptQuoteUseCase` (Order + Quote se escriben atómicamente) | `src/modules/core/domain/ports/transaction-context.ts`, `src/modules/core/application/ports/transaction-runner.port.ts`, `src/infrastructure/prisma/prisma-transaction-runner.ts` |
| Bug de DI (`PrismaModule` no importado) | Encontrado por el grupo "proveedor": varios módulos declaraban repositorios Prisma sin importar `PrismaModule` explícitamente, lo cual solo funcionaba por casualidad (por ser `PrismaModule` global y registrarse una vez en `AppModule`). Rompía toda prueba e2e que probara un módulo de forma aislada. Corregido en 6 módulos (`category`, `provider`, `service`, `availability`, `schedule`, `quote`) | Ver sección 5 |

---

## 3. VULNERABILIDADES CERRADAS POR MÓDULO

### 3.1 Identidad, credenciales, autenticación, perfiles

| # | Vulnerabilidad | Corrección | Archivo:línea |
|---|---|---|---|
| 1 | **Apropiación de cuenta vía `POST /credentials`** (crítica) — cualquiera con el `identityId` de una víctima podía adjuntarle su propia contraseña; el login tomaba la primera credencial activa, orden no determinista | Rechaza la creación si la Identity ya tiene **cualquier** credencial de tipo Password, sin importar su estado | `credentials/application/use_cases/create-credential.use-case.ts:70` |
| 2 | Sin throttle en `POST /credentials` | `@Throttle(5/60s)`, igual que login | `credentials/presentation/controllers/credential.controller.ts:75` |
| 3 | IDOR en Identity/Credential/Authentication/Profile por `:id` (get/update/delete) — 13 endpoints | Verificación de propiedad contra `@CurrentUser()` antes de cargar el recurso, `ForbiddenException` (403) si no coincide | Ver detalle abajo |
| 4 | Fuga de directorio de usuarios vía `GET /profiles` sin filtro | Escopado al identityId del caller | `profiles/application/use_cases/list-profile.use-case.ts:45` |
| 5 | `documentNumber` de Identity duplicable (ambigüedad de login) | Validación en `CreateIdentityUseCase` + **índice único** `@@unique([documentNumber])` en el schema | `identity/application/use_cases/create-identity.use-case.ts:35`, `prisma/schema.prisma:508`, migración `20260813000000_identity_document_number_unique` |

**Decisión de diseño relevante:** los perfiles con `visibility: Public` siguen siendo legibles por cualquier usuario autenticado (no solo el dueño) — una restricción estricta habría roto ~10 features del móvil que resuelven el perfil de otros usuarios (chat, órdenes, reseñas, marketplace, cotizaciones). Solo `visibility: Private` exige ser el dueño.

**Endpoints modificados:** `POST/PUT/DELETE/GET /identities(/:id)`, `POST/PUT/DELETE/GET /credentials(/:id)`, `PUT/DELETE/GET /authentications/:id`, `POST/PUT/DELETE/GET /profiles(/:id)`, `POST /profiles/:id/avatar`.

### 3.2 Proveedor, servicios, categorías, disponibilidad, agenda

| # | Vulnerabilidad | Corrección | Archivo:línea |
|---|---|---|---|
| 1 | **Auto-aprobación de proveedor** (crítica) — cualquiera podía mandar `{"status":"ACTIVE"}` a `PUT /providers/:id` | Regla exacta: Admin puede cualquier transición; el dueño **solo** `Rejected → Pending` (el único caso real que usa el móvil, para reenvío); cualquier otro valor de un no-admin → 403 | `provider/application/use_cases/update-provider.use-case.ts:60-80` |
| 2 | Cualquiera podía crear un Provider a nombre de otra Identity | `command.identityId === caller.id` salvo Admin | `create-provider.use-case.ts:66-70` |
| 3 | Edición/borrado cruzado de servicios entre proveedores | Resuelve el Provider dueño del servicio y compara `identityId` | `update-service.use-case.ts:64-78`, `delete-service.use-case.ts:38-47` |
| 4 | Cualquier usuario podía crear/editar/borrar categorías del marketplace | `@Roles(Role.Admin)` en las 3 rutas de escritura (nadie en el móvil las usa) | `category/presentation/controllers/category.controller.ts:62` |
| 5 | Edición/borrado de disponibilidad/agenda de otro proveedor | Ownership vía `ProviderRepository` en los 6 casos de uso de create/update/delete de ambos módulos | `availability/*`, `schedule/*` |
| 6 | `yearsOfExperience`, `basePrice`, `estimatedDuration` sin validar tipo/rango | `@IsInt() @Min(0)`, `@IsNumber() @Min(0.01)`, `@IsInt() @Min(1)` respectivamente | DTOs de provider/service |

**Bug de DI descubierto y corregido por este grupo** (beneficia a todo el backend): `CategoryPresentationModule` y 5 módulos más no importaban `PrismaModule`, rompiendo ~13 suites e2e con "PrismaService not available". Corregido agregando `PrismaModule` a los `imports` de cada `.module.ts` afectado.

**Endpoints modificados:** `POST/PUT/DELETE /providers(/:id)`, `POST/PUT/DELETE /services(/:id)`, `POST/PUT/DELETE /categories(/:id)`, `POST/PUT/DELETE /availabilities(/:id)`, `POST/PUT/DELETE /schedules(/:id)`.

### 3.3 Direcciones, contactos, auditoría, adjuntos, notificaciones

| # | Vulnerabilidad | Corrección | Archivo:línea |
|---|---|---|---|
| 1 | **5 listados globales sin filtro** (`GET /addresses`, `/contacts`, `/audit-records`, `/attachments`, `/notifications`) devolvían TODOS los registros de TODOS los usuarios | Escopados **en la consulta del repositorio** (no filtrados después), incluyendo `/search` de cada uno | `list-address.use-case.ts:20` + `prisma-address.repository.ts:55`, y análogos para los otros 4 |
| 2 | IDOR en get/update/delete de Address, Contact, Audit, Notification, Attachment | `ForbiddenException` (403) por propiedad | Ver commits `1e63f14`, `5f4d0d3`, `56cec2e`, `581882f`, `e644c32` |
| 3 | Suplantación al crear (`identityId` de otro en el body) | Rechazado en create de los 4 módulos con dueño directo | — |
| 4 | `Contact.value` no se validaba contra `Contact.type` (un "email" aceptaba cualquier texto) | Validación cruzada: formato email real si `type=Email`, formato teléfono si `type=Phone` | `contact.validator.ts` |

**Decisión de diseño documentada como riesgo residual, fuera de lo pedido explícitamente:** `POST /notifications` sigue permitiendo notificar a cualquier Identity — es el propósito mismo de la entidad (notificar al contraparte de una orden), y restringirlo a "solo notificarse a uno mismo" rompería el dominio. Cerrarlo bien requiere un concepto de cuenta de servicio que hoy no existe. **Sigue siendo un vector de abuso real (phishing-shaped) y queda documentado para una decisión de producto futura**, no para esta etapa de seguridad.

**Endpoints modificados:** `POST/PUT/DELETE/GET /addresses(/:id)`, `/contacts(/:id)`, `/audit-records(/:id)`, `/attachments(/:id)`, `/notifications(/:id)`, todos sus `/search`.

### 3.4 Órdenes, cotizaciones, pagos, reseñas

| # | Vulnerabilidad | Corrección | Archivo:línea |
|---|---|---|---|
| 1 | **Cancelar orden ajena** | Solo el cliente dueño o el Provider asignado (o Admin) | `cancel-order.use-case.ts:42` |
| 2 | **Iniciar/finalizar orden ajena** | Solo el Provider asignado (verificado antes del guard de estado) | `start-order.use-case.ts:39`, `complete-order.use-case.ts:39` |
| 3 | Leer/editar orden ajena | 403 (no 404 — la orden existe, solo no es tuya) | `get-order.use-case.ts:36`, `update-order.use-case.ts:34` |
| 4 | `GET /orders`, `/orders/search` sin filtro | `@Roles(Role.Admin)` — el móvil solo usa `/mine` y `/relevant-for-provider`, ya correctamente escopados desde antes | `order.controller.ts:262,315` |
| 5 | Cotizar en nombre de otro proveedor | `@Roles(Role.Provider)` + verificación de que el `providerId` resuelve al caller | `create-quote.use-case.ts:58` |
| 6 | **Aceptar/rechazar cotización ajena** | Solo el cliente dueño de la Order referenciada | `accept-quote.use-case.ts:54`, `reject-quote.use-case.ts:34` |
| 7 | Editar cotización de un competidor | Solo el Provider emisor | `update-quote.use-case.ts:35` |
| 8 | **Leer pagos de terceros** (requisito explícito) | `GET /payments`, `/search`, `/:id` escopados: solo se ven pagos donde el caller es pagador o proveedor receptor | `list-payment.use-case.ts`, `get-payment.use-case.ts:32` |
| 9 | Pagar/modificar/cancelar a nombre de otro | Solo el `payerIdentityId` original | `create-payment.use-case.ts:52`, `update/cancel-payment.use-case.ts` |
| 10 | Reseñar/editar/borrar en nombre de otro | Solo el `reviewerIdentityId` original | `create-review.use-case.ts:49`, `update/delete-review.use-case.ts` |
| 11 | **`rating` sin rango válido** (aceptaba `1000000` o `-5`) | Entero 1–5 exigido en el value object de dominio **y** en el DTO (doble capa) | `review-rating.value-object.ts` |

**⚠️ Cambio de comportamiento esperado y buscado, no una regresión:** el móvil usa hoy `PUT /orders/:id/cancel` para dos cosas distintas — que el cliente cancele su propia orden, y que un proveedor "rechace" una solicitud **abierta y sin asignar** de su categoría. Con esta corrección, la segunda llamada **ahora devuelve 403**, porque una orden sin asignar no tiene lado proveedor: ese proveedor nunca fue parte de ella. Antes de este arreglo, "rechazar" cancelaba la orden completa del cliente para todos los demás proveedores que podían cotizarla — **un bug real de pérdida de datos**, no una función legítima. El arreglo del botón "Rechazar" en el móvil (que debería simplemente ocultar la solicitud localmente, sin llamar a este endpoint) queda como un ticket de producto/frontend separado, fuera del alcance backend de esta etapa.

**Endpoints modificados:** `PUT /orders/:id/{cancel,start,complete}`, `GET/PUT /orders(/:id)`, `POST/PUT /quotes(/:id)`, `PUT /quotes/:id/{accept,reject}`, `POST/PUT/GET /payments(/:id)`, `PUT /payments/:id/cancel`, `POST/PUT/DELETE /reviews(/:id)`.

### 3.5 Chat, mensajes, verificación KYC, confianza

| # | Vulnerabilidad | Corrección | Archivo:línea |
|---|---|---|---|
| 1 | `GET /chats`, `/search` devolvían todos los chats del sistema | Escopados por participación (cliente o proveedor), resuelto vía `chat-participation.service.ts` | `prisma-chat.repository.ts:73` |
| 2 | Leer/cerrar chat ajeno | Solo un participante o Admin | `get-chat.use-case.ts:29`, `close-chat.use-case.ts:26` |
| 3 | **Leer mensajes privados de cualquier par de usuarios** (el hallazgo más grave de este grupo) — `GET /messages` sin filtro alguno | Escopado por join contra el Chat del caller | `prisma-message.repository.ts:66` |
| 4 | Enviar mensaje sin verificar que el remitente sea participante del chat | Rechaza suplantación de remitente **y** verifica participación real | `send-message.use-case.ts:46-62` |
| 5 | Borrar mensaje ajeno | Solo el remitente original o Admin | `delete-message.use-case.ts:26-33` |
| 6 | **Auto-aprobación de verificación KYC** (segunda más crítica del backend) — cualquiera podía `PUT /verifications/:id` con `status: APPROVED` | Misma regla que Provider: Admin decide cualquier estado; el dueño solo `Rejected → Pending`; el resto 403 | `update-verification.use-case.ts:53-70` |
| 7 | `GET /verifications`, `/search`, `/:id` exponían todos los registros KYC | Escopados al dueño (o Admin) | `list/search/get-verification.use-case.ts` |
| 8 | Subida de documento sin límite de tamaño ni verificación real de tipo | Límite de 10MB en el `FileInterceptor`; verificación de "magic bytes" (firma binaria real) contra el `Content-Type` declarado — ya no basta con falsificar el header | `verification.controller.ts:244`, `verification.validator.ts:87-110` |
| 9 | **Auto-fijación de `TrustScore`** — cualquiera podía poner cualquier puntaje a cualquier perfil | `PUT /trust-profiles/:id` gateado a `@Roles(Role.Admin)` completo (el móvil nunca lo usa) | `trust.controller.ts:127` |
| 10 | `score` sin rango válido | `0–100` exigido en validador y DTOs | `trust.validator.ts:8-14` |

**Endpoints modificados:** `POST/PUT/GET /chats(/:id)`, `PUT /chats/:id/close`, `POST/DELETE/GET /messages(/:id)`, `POST/PUT/GET /verifications(/:id)`, `POST /verifications/:id/document`, **nuevo** `GET /verifications/:id/document`, `POST/PUT/GET /trust-profiles(/:id)`.

---

## 4. CAMBIOS ARQUITECTÓNICOS

- **`TransactionRunner`** (puerto de dominio + aplicación + adaptador Prisma) — primer mecanismo de transacciones reales del backend, aplicado a `AcceptQuoteUseCase` (Order + Quote atómicos). Ningún otro caso de uso en todo el backend hace más de una escritura, así que no hizo falta en otro lado (verificado exhaustivamente antes de construirlo).
- **Autorización como capa explícita de Aplicación**, no un adorno en el controlador: cada módulo introdujo su propio archivo de reglas de ownership (`ownership.ts` compartido en `core/application`, más `order-access.ts`, `quote-access.ts`, `chat-participation.service.ts`, `review-access.ts`, `payment-access.ts` específicos por dominio) — consistente con Clean Architecture: la regla de negocio "quién puede tocar esto" vive en Aplicación, no en el Guard HTTP.
- **`RolesGuard` pasó de existir-pero-nunca-usarse a aplicarse explícitamente** con `@Roles(...)` en cada endpoint que lo requiere (crear servicio, disponibilidad, agenda → solo Provider; escribir categorías → solo Admin; aprobar Provider/Verification/Trust → solo Admin).
- **Autorización por propiedad vs. por rol, aplicadas donde corresponde cada una:** browsing público del marketplace (proveedores, servicios, categorías, reseñas, trust) permanece abierto a cualquier autenticado — restringirlo habría roto el descubrimiento de servicios, que es el propósito central de la app.

---

## 5. RIESGOS CONOCIDOS Y PENDIENTES (documentados, no resueltos en esta etapa por estar fuera del alcance explícito)

1. **`POST /orders` no valida que `identityId` sea el del caller** — se puede crear una orden a nombre de otra Identity (impersonación, sin fuga de datos). No se cerró porque cambiar el contrato 404 de ese endpoint no estaba en la lista explícita de módulos/reglas pedida.
2. **`POST /notifications` permite notificar a cualquier Identity** — es el propósito de la entidad; cerrarlo bien requiere una decisión de producto (cuenta de servicio / origen confiable), no un simple check de ownership.
3. **El botón "Rechazar solicitud" del proveedor en el móvil** ahora recibirá 403 en vez de cancelar silenciosamente la orden del cliente — comportamiento backend correcto y buscado, pero el frontend necesita su propio ajuste (ocultar localmente en vez de llamar al endpoint) en una etapa de producto separada.
4. **El registro del cliente (paso 4, `POST /profiles`) ya fallaba con 401 antes de esta etapa** por ejecutarse sin sesión iniciada; con el endurecimiento de ownership, seguiría fallando por el mismo motivo (401, no un 403 nuevo). Es un bug preexistente del flujo móvil, no introducido aquí.

Ninguno de estos 4 puntos es un TODO/FIXME/HACK en el código — están documentados en los reportes de cada agente y en este informe, tal como pediste ("no dejes TODO/FIXME/HACK").

---

## 6. COMPATIBILIDAD

- **Frontend:** cero archivos de `apps/mobile` modificados en toda la etapa. `flutter analyze` (0 errores/warnings, mismos 78 `info` cosméticos de siempre) y `flutter test` (885/885) confirmaron cero regresiones.
- **API pública:** ninguna ruta se eliminó, ningún contrato de respuesta cambió de forma. Los únicos cambios de comportamiento visibles son los explícitamente buscados por esta etapa (403 donde antes había una operación insegura permitida) — documentados en la sección 5.
- **Base de datos / migraciones:** una sola migración nueva y aditiva (`20260813000000_identity_document_number_unique`), aplicada en producción vía `prisma migrate deploy` sin downtime, confirmada por el `GET /health` post-despliegue.
- **APK:** generado contra el backend público ya endurecido (ver sección 8).

---

## 7. PRUEBAS EJECUTADAS Y COBERTURA

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` (backend, tras cada integración y al final) | ✅ Limpio |
| `npm test` (unitarias, backend) | ✅ **184 suites, 1114 tests, 0 fallos** |
| `npm run test:e2e` (integración HTTP completa, 23 módulos) | ✅ **23 suites, 312 tests, 0 fallos** |
| `npm run build` | ✅ Limpio |
| `npx prisma validate` | ✅ Schema válido |
| `flutter analyze` | ✅ 0 errores, 0 warnings |
| `flutter test` | ✅ **885/885** |
| Railway — estado del servicio | ✅ Online |
| Railway — `GET /health` (conectividad real a MySQL) | ✅ `{"status":"ok","database":"ok"}` |
| Railway — `GET /docs` | ✅ HTTP 200 |

**Cobertura ganada:** cada módulo tocado recibió pruebas nuevas específicas para los casos de autorización (dueño vs. tercero vs. Admin), agregadas por cada grupo de trabajo antes de considerar su parte terminada — no solo se hicieron pasar los tests existentes, se agregaron regresiones para los escenarios que antes eran vulnerabilidades.

---

## 8. DESPLIEGUE Y ENTREGA

- **GitHub:** `28` commits nuevos en `main`, push confirmado (`28fda2d..4266436`).
- **Railway:** variable `CORS_ORIGIN` actualizada de `*` a un valor explícito (requisito "no usar `*`"); redeploy disparado automáticamente por el push; migración aplicada; servicio confirmado sano post-despliegue.
- **APK:** compilado en release contra el backend público ya endurecido, firmado con el keystore estable del proyecto, entregado al usuario.

---

*Fin del informe.*
