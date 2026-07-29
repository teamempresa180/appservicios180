# ESTADO ACTUAL DEL PROYECTO APP SERVICIOS 180°

> Documento de traspaso técnico. Generado el 2026-07-28 a partir de lectura directa del código fuente, `git log`/`git status`, y grep exhaustivo del repositorio — no de la narrativa de `PROJECT_STATUS.md`/`SPRINT3_PREPARATION.md`, que quedan desactualizados respecto al HEAD real (ver sección 15). Cuando un dato no pudo confirmarse con certeza en el código, se indica explícitamente en vez de asumirlo. Nada en este documento está inventado.

---

## 1. Resumen general

**SERVICIOS 180°** es un marketplace de servicios a domicilio (tipo "Uber de servicios"): conecta **clientes** que necesitan contratar un servicio (plomería, electricidad, limpieza, etc.) con **proveedores** independientes que los ofrecen. Resuelve el problema de descubrimiento y confianza en la contratación de servicios informales/independientes: el cliente publica una solicitud o busca un proveedor por categoría, recibe cotizaciones, elige una, se comunica por chat, paga y califica el servicio al finalizar. El proveedor, del lado opuesto, gestiona su disponibilidad, sus servicios ofrecidos, cotiza solicitudes entrantes y atiende su propio dashboard de pedidos.

Es un proyecto pensado explícitamente **para uso comercial real** (no un prototipo desechable): tiene autenticación JWT completa con rotación de refresh tokens, hashing de contraseñas con bcrypt, verificación de identidad de proveedores con subida de documentos, y una arquitectura backend en Clean Architecture/DDD con 22 módulos de negocio completos de dominio a persistencia real (PostgreSQL vía Prisma).

**Arquitectura de alto nivel**: monorepo con dos aplicaciones —
- `apps/backend`: API REST en NestJS, Clean Architecture (Domain/Application/Infrastructure/Presentation) + DDD, persistencia en PostgreSQL vía Prisma ORM.
- `apps/mobile`: cliente Flutter multiplataforma (compilado y verificado en este documento para Windows desktop; también soporta Android/iOS/Web por configuración de Flutter, sin verificación exhaustiva de esos targets en esta sesión), arquitectura por features con Repository Pattern (interfaz + implementación Mock + implementación Http), inyección de dependencias con `get_it`, navegación con `go_router`.

**Estado actual del desarrollo** (visión general, detalle en secciones 4, 5 y 14):
- El **backend** tiene sus 22 módulos de negocio completos en las 4 capas, con persistencia Prisma/PostgreSQL real (sin ningún stub), y autenticación JWT + guards aplicados en prácticamente todos los endpoints protegidos.
- El **frontend Flutter** tiene 24 de 25 repositorios de datos con implementación HTTP real contra el backend (el único permanentemente Mock es `tracking`, por ausencia deliberada de infraestructura de tiempo real). Sin embargo, **el flag que decide si la app usa el backend real o datos simulados (`USE_MOCK_BACKEND`) tiene como valor por defecto `true`** — es decir, sin pasar explícitamente `--dart-define=USE_MOCK_BACKEND=false` al compilar/ejecutar, la app entera funciona con datos simulados aunque el backend esté disponible.
- Existen **eslabones de negocio genuinamente incompletos** en la cadena end-to-end: no hay aprobación real (con UI) de proveedores, no hay transición de estado de una Order más allá de cancelarla, no hay integración de pasarela de pago real, y el tracking en tiempo real es 100% simulado (ver sección 12).
- El repositorio Git está **limpio** (`nothing to commit, working tree clean`) al momento de este documento, con el commit `b32ff5a` como HEAD.

---

## 2. Stack tecnológico

**Backend**
- Node.js + NestJS 11 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)
- TypeScript
- `@nestjs/jwt` + `@nestjs/passport` + `passport` + `passport-jwt` para autenticación
- `@nestjs/swagger` para documentación OpenAPI (`GET /docs`)
- `bcryptjs` para hashing de contraseñas (JS puro, sin dependencias nativas de compilación)
- `reflect-metadata`, `rxjs` (dependencias de soporte de Nest)
- Testing: Jest (`test`, `test:e2e`, `test:integration` como scripts separados)

**Frontend**
- Flutter (SDK 3.44.8 stable al momento de este documento) + Dart 3.12.2
- `go_router` para navegación estructural
- `get_it` para inyección de dependencias (service locator)
- `dio` para el cliente HTTP (`ApiClient`, con interceptores propios)
- `flutter_secure_storage` para persistencia segura de tokens
- `google_fonts`, `google_maps_flutter` (+ variante web) como dependencias de UI/mapas
- `hooks` (flutter_hooks), `record_use`, otras dependencias de soporte

**Base de datos**
- PostgreSQL 16 (imagen `postgres:16-alpine`), actualmente corriendo en un contenedor Docker local (`appservicios-pg`, puerto host `55432` mapeado a `5432` del contenedor) — **no hay `docker-compose.yml` en el repo**; el contenedor se levantó manualmente con `docker run`.
- Migración a **MySQL** solicitada por el usuario y **en preparación, aún no ejecutada** (ver sección 16 y nota al final de este documento) — pendiente de un dato de conexión (host) antes de tocar `schema.prisma`.

**ORM**
- Prisma 5.22.0 (`@prisma/client`, `prisma`). Nota: hay una actualización mayor disponible (7.9.1) no aplicada — quedarse en 5.x fue una decisión implícita de continuidad, no confirmada como intencional en ningún comentario del código.

**Docker**
- Sólo usado para levantar Postgres en desarrollo local, vía el comando documentado en `apps/backend/.env.example`:
  ```
  docker run -d --name appservicios-pg -e POSTGRES_USER=appservicios \
    -e POSTGRES_PASSWORD=appservicios -e POSTGRES_DB=appservicios \
    -p 5432:5432 postgres:16-alpine
  ```
  (En este entorno de desarrollo se usó `-p 55432:5432` en vez de `5432:5432`, para que coincida con el `DATABASE_URL` ya presente en `apps/backend/.env`.)
- No hay `Dockerfile` para empaquetar el backend ni el frontend — el despliegue a producción no está definido en este repositorio.

**Autenticación**
- JWT (access + refresh tokens, secretos independientes), con rotación de refresh tokens de un solo uso, revocación server-side, y derivación de rol en tiempo de login/refresh (no hay campo `role` persistido — ver sección 6).

**Comunicación**
- REST puro (JSON sobre HTTP) entre Flutter y NestJS. **No hay WebSockets implementados en ningún punto del proyecto** (ver sección 8) — ni para chat en tiempo real ni para tracking en vivo.

**Dependencias importantes adicionales**
- `class-validator`/`class-transformer` (uso estándar de Nest para DTOs, asumido por convención de NestJS aunque no se listó explícitamente en la investigación — confirmar en `package.json` si se requiere certeza total).
- `multer` (vía `FileInterceptor` de Nest) para subida de archivos multipart (avatares, documentos de verificación).

---

## 3. Arquitectura

### Backend: Clean Architecture + DDD, módulo por módulo

Cada uno de los 22 módulos de negocio bajo `apps/backend/src/modules/` sigue **exactamente la misma estructura de 4 capas**:

```
modules/<nombre>/
├── domain/
│   ├── entities/           <Nombre>.entity.ts        (entidad de dominio pura, sin dependencias de framework)
│   └── value-objects/       <Nombre>Status.value-object.ts, etc.  (enums de dominio)
├── application/
│   ├── use_cases/           Create/Update/Delete/Get/List/Search<Nombre>UseCase
│   ├── validators/           <Nombre>Validator (valida reglas de negocio antes de tocar el dominio)
│   ├── dto/                  DTOs de aplicación (contratos internos, no HTTP)
│   ├── mappers/               (cuando aplica)
│   └── commands/               (para casos de uso más complejos, p.ej. upload-verification-document.command.ts)
├── infrastructure/
│   └── persistence/
│       ├── prisma-<nombre>.repository.ts        (implementación real del puerto Repository, usa Prisma Client)
│       └── <nombre>-prisma.mapper.ts             (traduce entidad de dominio ↔ modelo Prisma)
│   └── storage/                                    (sólo en profiles y verification — subida de archivos)
└── presentation/
    ├── controllers/            <Nombre>Controller (NestJS @Controller)
    ├── dto/                     Request/Response DTOs HTTP + mappers HTTP
    ├── routes/                   <nombre>.routes.ts (definición de rutas)
    └── swagger/                    documentación OpenAPI del módulo
```

**Repository Pattern**: cada módulo define un puerto (`application/ports/*.repository.ts`, patrón de interfaz) que la capa Application consume por abstracción; la capa Infrastructure provee la implementación concreta (`Prisma<Nombre>Repository`) que NestJS inyecta vía su contenedor de DI nativo (`@Injectable()` + tokens de módulo).

**Use Cases**: cada operación de negocio es una clase con un único método público (`execute()`), inyectada con sus dependencias (repositorio, validador, otros use cases si necesita verificar entidades relacionadas). Los Use Cases de `Order`, `Quote`, `Payment`, `Review`, `Chat`, `Message`, `Notification`, `Attachment` devuelven `null` cuando no encuentran la entidad (el Controller traduce a `NotFoundException`); el resto de módulos (`Identity`, `Authentication`, `Credential`, `Profile`, `Contact`, `Address`, `Verification`, `Trust`, `Category`, `Service`, `Provider`, `Availability`, `Schedule`) lanzan `NotFoundException` directamente desde el Use Case — **inconsistencia estilística real entre módulos, documentada aquí para que quien continúe no la confunda con un bug**.

**Presentation**: Controllers NestJS delgados — validan el shape HTTP (vía DTOs), delegan al Use Case correspondiente, mapean la respuesta de dominio a un Response DTO HTTP. Nunca contienen lógica de negocio.

**Dependency Injection**: contenedor nativo de NestJS (`@Module`, `@Injectable`, providers registrados por módulo en `*.module.ts`). No se usa ningún framework de DI adicional.

**Shared kernel**: la carpeta `modules/core/` no es un módulo de negocio — contiene las excepciones de dominio compartidas (`NotFoundException`, `ValidationException`, `BusinessRuleException`, `UnauthorizedException`, `ForbiddenException`) que cualquier módulo puede lanzar, capturadas centralmente por `DomainExceptionFilter` en `main.ts` y traducidas a códigos HTTP consistentes (404, 400, 422, 401, 403 respectivamente).

### Frontend: arquitectura por features con Repository Pattern

Cada feature bajo `apps/mobile/lib/features/<nombre>/` sigue el mismo patrón:

```
features/<nombre>/
├── models/ (o se reutiliza una entidad compartida fuera de features/)
├── repositories/
│   ├── <nombre>_repository.dart          (interfaz abstracta)
│   ├── mock_<nombre>_repository.dart      (implementación en memoria, para desarrollo sin backend)
│   └── http_<nombre>_repository.dart       (implementación real contra la API)
└── presentation/
    ├── pages/
    ├── widgets/
    └── view_models/ (cuando la pantalla tiene estado/lógica no trivial)
```

**Inyección de dependencias**: `get_it` (service locator global, `apps/mobile/lib/core/di/service_locator.dart`). Cada repositorio se registra una sola vez al arrancar la app, eligiendo la implementación Mock o Http según `ApiConfig.useMockBackend` — el resto de la app nunca sabe ni le importa cuál está activa, sólo depende de la interfaz.

**Organización de la solución**: la mayor parte de la lógica de UI/negocio vive en `apps/mobile/lib/features/*`; `apps/mobile/lib/core/*` contiene la infraestructura transversal (red, sesión, navegación, tema, DI); hay además un puñado de carpetas de entidades compartidas fuera de `features/` en la raíz de `lib/` (`address/`, `authentication/`, `contact/`, `order/`, `profiles/`, `provider/`, `quote/`, `service/`, `verification/`) que definen los modelos de dominio del lado cliente, usados por más de una feature.

---

## 4. Backend

### 4.1 Módulos existentes (23 carpetas, 22 de negocio + 1 shared kernel)

`address`, `attachment`, `audit`, `authentication`, `availability`, `category`, `chat`, `contact`, `core` (shared kernel, no es módulo de negocio), `credentials`, `identity`, `message`, `notification`, `order`, `payment`, `profiles`, `provider`, `quote`, `review`, `schedule`, `service`, `trust`, `verification`.

**Los 22 módulos de negocio están completos en las 4 capas y todos tienen repositorio Prisma real — no queda ningún stub en memoria.** Confirmado leyendo los 22 controllers y sus rutas.

No hay `app.setGlobalPrefix()` en `main.ts` — las rutas son exactamente las declaradas en cada `@Controller(...)`, sin prefijo `/api` global.

### 4.2 Endpoints por módulo (rutas REST completas)

Todos los endpoints de `list`/`search` aceptan `?page=` y `?pageSize=` opcionales; `list` devuelve `{ items, total, page, pageSize }`, `search` devuelve un array plano.

**Identity** (`/identities`):
- `POST /identities` — **público**. `CreateIdentityRequestDto { fullName, documentType, documentNumber, birthDate }` → `IdentityResponseDto`.
- `PUT /identities/:id`, `DELETE /identities/:id`, `GET /identities/:id` — con `JwtAuthGuard`.

**Authentication** (`/authentications`):
- `POST /authentications` — **público**. Crea el método de autenticación (`methodType: PASSWORD`), paso del registro.
- `PUT /authentications/:id`, `DELETE /authentications/:id`, `GET /authentications/:id` — con guard.
- `POST /authentications/login` — **público**, `HttpCode(200)`. `LoginRequestDto { documentNumber, password }` → `AuthTokensResponseDto { accessToken, refreshToken, tokenType: 'Bearer', expiresIn, role }`.
- `POST /authentications/refresh` — **público**. `RefreshRequestDto { refreshToken }` → mismo shape de respuesta.
- `POST /authentications/logout` — **público**. `LogoutRequestDto { refreshToken }`.
- `GET /authentications/me` — con guard. Devuelve `CurrentUserResponseDto` desde `@CurrentUser()`.

**Credentials** (`/credentials`):
- `POST /credentials` — **público**. `CreateCredentialRequestDto { identityId, type, password? }` (password obligatorio y validado ≥8 caracteres si `type=PASSWORD`, nunca logueado).
- `PUT /credentials/:id`, `DELETE /credentials/:id`, `GET /credentials/:id` — con guard.

**Profiles** (`/profiles`) — controller entero protegido:
- `POST /profiles`, `PUT /profiles/:id`, `DELETE /profiles/:id`, `GET /profiles`, `GET /profiles/search?term=`, `GET /profiles/:id`.
- `POST /profiles/:id/avatar` — multipart (`FileInterceptor('file')`), sube avatar a disco local.

**Contact** (`/contacts`), **Address** (`/addresses`) — CRUD + list + search estándar, con guard.

**Verification** (`/verifications`) — con guard: `POST`, `PUT /:id`, `GET`, `GET /search`, `GET /:id`, `POST /:id/document` (multipart). **Sin endpoint Delete.**

**Trust** (`/trust-profiles`) — con guard: `POST`, `PUT /:id`, `GET`, `GET /search`, `GET /:id`. Sin Delete. Invariante 1:1 con Identity (`TrustModel.identityId` es `@unique` en Prisma).

**Audit** (`/audit-records`) — con guard: `POST`, `GET`, `GET /search`, `GET /:id`. **Sin Update/Delete** (inmutable por diseño).

**Category** (`/categories`), **Service** (`/services`), **Provider** (`/providers`) — CRUD + list + search completo, con guard. `CreateServiceUseCase` verifica que Category y Provider existan; `CreateProviderUseCase` verifica Identity y Profile, e impone invariante 1:1 Identity↔Provider (viola → `BusinessRuleException`, HTTP 422).

**Availability** (`/availabilities`), **Schedule** (`/schedules`) — CRUD + list + search, con guard.

**Order** (`/orders`) — con guard: `POST`, `PUT /:id`, `PUT /:id/cancel`, `GET`, `GET /search`, `GET /:id`. **Sin Delete — `cancel` es la única transición de estado soportada por el backend** (ver limitación crítica en sección 10 y 12).

**Quote** (`/quotes`) — con guard: `POST`, `PUT /:id`, `PUT /:id/accept`, `PUT /:id/reject`, `GET`, `GET /search`, `GET /:id`. Sin Delete.

**Payment** (`/payments`) — con guard: `POST`, `PUT /:id`, `PUT /:id/cancel`, `GET`, `GET /search`, `GET /:id`. Sin Delete.

**Review** (`/reviews`) — con guard: `POST`, `PUT /:id`, `DELETE /:id`, `GET`, `GET /search`, `GET /:id`.

**Chat** (`/chats`) — con guard: `POST`, `PUT /:id/close`, `GET`, `GET /search`, `GET /:id`. Sin Update/Delete.

**Message** (`/messages`) — con guard: `POST` (enviar), `DELETE /:id`, `GET`, `GET /search`, `GET /:id`. Sin Update/markAsRead.

**Notification** (`/notifications`) — con guard: `POST`, `PUT /:id/read`, `DELETE /:id`, `GET`, `GET /search`, `GET /:id`.

**Attachment** (`/attachments`) — con guard: `POST`, `DELETE /:id`, `GET`, `GET /search`, `GET /:id`.

### 4.3 Módulos nuevos creados recientemente

Según el último commit (`b32ff5a`) y las dos migraciones más recientes:
- **Subida de documento de verificación**: `application/commands/upload-verification-document.command.ts`, `application/use_cases/upload-verification-document.use-case.ts`, `infrastructure/storage/local-verification-document-storage.service.ts` (+ su spec).
- **Subida de avatar de perfil**: `application/commands/update-profile-avatar.command.ts`, `application/use_cases/update-profile-avatar.use-case.ts`, `infrastructure/storage/local-profile-avatar-storage.service.ts`.
- **Estado `PENDING` de Provider**: `ProviderStatus` enum extendido, `CreateProviderUseCase` ajustado para crear providers en `PENDING` en vez de `ACTIVE` directamente.

### 4.4 Migraciones realizadas (cronología completa)

```
20260711183332_init_identity_access
20260711204752_add_profile
20260711212512_add_contact_address
20260711221331_add_verification_trust_audit
20260712105903_add_category_service
20260712113712_add_provider_availability_schedule
20260712183138_add_order_quote
20260712190259_add_payment_review
20260712194156_add_communication
20260715211831_add_authentication_credentials
20260721170000_add_verification_document
20260721235557_add_pending_provider_status
```

`schema.prisma` tiene 897 líneas, provider `postgresql`, 22 modelos (uno por módulo de negocio; no existe `MarketplaceModel`/`SearchModel` — "Marketplace" se satisface con Category+Service+Provider, "Search" con el método `search()` de cada repositorio).

### 4.5 Decisiones arquitectónicas importantes

- **Rol derivado, no persistido**: no existe un campo `role` en `Identity`. El rol (`Customer`/`Provider`) se calcula en cada login/refresh mirando si existe un `Provider` `ACTIVE` para esa identidad (ver sección 6).
- **Un solo secreto JWT por tipo de token** (access/refresh separados), con generación efímera fuera de producción si no están configurados, y fail-fast en producción si faltan (`env.validation.ts`).
- **Almacenamiento de archivos en disco local**, no en la nube — limitación real y documentada (ver sección 9).
- **Sin filtros server-side en varios `GET` de lista** (`?orderId=`, `?chatId=`, etc.) — el cliente Flutter trae todo y filtra client-side; documentado en el propio código como forma interina, riesgo de escalabilidad conocido, no bloqueo funcional hoy.
- **`RolesGuard`/`@Roles()` construidos pero sin aplicar a ningún endpoint** — cualquier usuario autenticado (Customer o Provider) puede llamar cualquier endpoint protegido hoy; no hay distinción de permisos por rol todavía.
- **Sin transición de estado completa para `Order`** — sólo existe `cancel`; no hay endpoint para mover una Order de `PENDING` a `ACCEPTED`/`IN_PROGRESS`/`COMPLETED` aunque esos valores existen en el enum `OrderStatus` (ver sección 12, esto es una limitación crítica reconocida).

---

## 5. Frontend

### 5.1 Arquitectura general

Ver sección 3 para el patrón de feature-folder. Cada feature con datos propios expone una interfaz `<Nombre>Repository` con dos implementaciones intercambiables (`Mock...`/`Http...`), seleccionadas centralmente en el service locator.

### 5.2 Inyección de dependencias (`core/di/service_locator.dart`)

Usa `get_it`. Orden de construcción (importante por una dependencia circular resuelta deliberadamente):
1. `TokenProviderHolder` (implementa `TokenProvider`, con un delegado adjuntable después) se registra primero.
2. `ApiClient(tokenProviderHolder)` se construye contra el holder (aún sin delegado real).
3. `SecureTokenStorage`, `ThemeModeController`, `AppShellNavigationIntent`, `UserRoleController`, `ProviderAvailabilityController` — singletons de infraestructura/sesión auxiliar.
4. `AuthRepository` se registra (`MockAuthRepository` o `HttpAuthRepository(apiClient)` según el flag).
5. Se construye `SessionManager(authRepository, tokenStorage)` y se adjunta al holder (`tokenProviderHolder.attach(sessionManager)`) — así `ApiClient` termina usando el `SessionManager` real como fuente de tokens sin depender directamente de `session/` (rompe el ciclo `network → session → network`).
6. Se registran 25 repositorios de features (ver sección 5.6 para el detalle Mock/Http de cada uno).
7. **Excepción explícita**: `TrackingRepository` se registra **siempre** como `MockTrackingRepository()`, sin condicional — no existe `HttpTrackingRepository` en el filesystem.

### 5.3 HTTP (`core/network/`)

**`api_config.dart`**:
```dart
static const String baseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000');
static const bool useMockBackend = bool.fromEnvironment('USE_MOCK_BACKEND', defaultValue: true);
```
**El valor por defecto de `useMockBackend` es `true`.** Compilar/ejecutar sin `--dart-define=USE_MOCK_BACKEND=false` explícito hace que toda la app use datos simulados, sin importar cuán completo esté el backend real. `resolveUploadUrl(path)` resuelve rutas relativas devueltas por el backend a URL absoluta, dejando pasar URLs ya absolutas o `data:` URIs sin modificar.

**`api_client.dart`** — `Dio` con 4 interceptores, en este orden exacto:
1. **`AuthInterceptor`** — adjunta `Authorization: Bearer <token>` desde `TokenProvider.accessToken` si no hay ya un header explícito.
2. **`RetryInterceptor`** — hasta `maxRetries=2`, backoff `300ms * intento`, sólo en fallos de conectividad/timeout (nunca en una respuesta HTTP real — un 404 sigue siendo 404). Opt-out vía `extra['noRetry']=true`.
3. **`RefreshInterceptor`** — en un 401 (que no sea la propia llamada a `/authentications/refresh`), intenta **exactamente un** refresh; llamadas concurrentes esperan la misma promesa (`_refreshInFlight`) en vez de disparar refresh duplicados (el backend rota tokens de un solo uso). Usa un `Dio` propio sin interceptores para la llamada de refresh (evita recursión). Si el refresh falla, invoca `tokenProvider.onSessionExpired()`.
4. **`LoggingInterceptor`** — observa todo, incluidas las reescrituras de los tres anteriores.

`ErrorMapper.fromDioException` traduce a una jerarquía propia (`http_exceptions.dart`): `BadRequestHttpException` (400), `UnauthorizedHttpException` (401), `ForbiddenHttpException` (403), `NotFoundHttpException` (404), `UnprocessableEntityHttpException` (422), `ServerHttpException` (resto 5xx/otros), `NetworkHttpException` (sin respuesta/timeout), `CancelledHttpException`. Los repositorios sólo capturan `HttpException`, nunca `DioException` directamente.

### 5.4 SessionManager (`core/session/session_manager.dart`)

`SessionManager extends ChangeNotifier implements TokenProvider` — única fuente de verdad de sesión.
- Estado en memoria: `_accessToken`, `_refreshToken`, `_currentUserId`, `_currentRole`, `_isRestoring`.
- **Almacenamiento seguro**: `SecureTokenStorage` (wrapper sobre `flutter_secure_storage`) — únicas claves persistidas en disco: `auth.access_token`, `auth.refresh_token`. `currentUserId`/`currentRole` **no** se persisten — se recalculan llamando `GET /authentications/me` en `restore()`.
- `restore()`: lee tokens; si existen, llama `.me()` (se beneficia transparentemente de `RefreshInterceptor` si sólo el access token expiró); en `HttpException` limpia la sesión. `isRestoring` mantiene la UI en Splash hasta terminar.
- `login()`: llama `AuthRepository.login`, aplica tokens, luego llama `.me()` para poblar usuario/rol.
- `logout()`: intenta revocar el refresh token server-side (best-effort, ignora fallos), limpia estado local siempre.
- Implementa `onTokensRefreshed`/`onSessionExpired` de `TokenProvider` — así `RefreshInterceptor` actualiza/expira la sesión sin conocer `SessionManager` directamente.

### 5.5 ViewModels, pantallas, navegación

- Las features con lógica no trivial exponen un `<Nombre>ViewModel` propio (patrón `ChangeNotifier` observado en varios features — p. ej. `PaymentsViewModel`, `ChatListViewModel`, `ProviderRequestsViewModel`, `ServiceDetailViewModel`, `ProviderProfileViewModel`, `SearchViewModel`).
- **Navegación estructural**: `go_router` (`GoRouter`), rutas definidas en `core/navigation/routes/app_routes.dart` (`/`, `/onboarding`, `/login`, `/register`, `/select-role`, `/home`, `/become-provider`). Navegación local dentro de una feature usa `Navigator.push` (decisión intencional documentada en `SPRINT3_PREPARATION.md`).
- **`AppRouteGuard`** (`core/navigation/guards/app_route_guard.dart`) es un **guard real y funcional**, no un placeholder — consulta `SessionManager.isAuthenticated`/`isRestoring`: si no autenticado y la ruta no es pública → redirige a `/login`; si autenticado y la ruta es sólo pre-auth (`login`/`register`/`select-role`) → redirige a `/home`. El `GoRouter` se reevalúa automáticamente en cada cambio de `SessionManager` (`refreshListenable`). **Esto contradice documentación histórica que lo describía como "siempre permite"** — es un hallazgo de discrepancia entre `SPRINT3_PREPARATION.md`/secciones antiguas de `PROJECT_STATUS.md` y el código real actual.

### 5.6 Estado Mock vs Http por feature

| Feature | Repositorio | Estado |
|---|---|---|
| address_management | `AddressManagementRepository` | Http/Mock (condicional por flag) |
| availability | `AvailabilityRepository` | Http/Mock |
| become_provider | `BecomeProviderRepository` | Http/Mock |
| categories | `CategoryRepository` | Http/Mock |
| chat | `ChatRepository` | Http/Mock |
| contact_management | `ContactManagementRepository` | Http/Mock |
| marketplace | `CategoryRepository`/`ProviderRepository`/`ServiceRepository` (3 repos) | Http/Mock (los 3) |
| notifications | `NotificationsRepository` | Http/Mock |
| orders | `OrdersRepository` | Http/Mock |
| payments | `PaymentsRepository` | Http/Mock |
| profile | `ProfileRepository` | Http/Mock |
| provider_dashboard | `ProviderDashboardRepository` | Http/Mock |
| provider_profile | `ProviderProfileRepository` | Http/Mock |
| provider_services | `ProviderServicesRepository` | Http/Mock |
| quote | `QuoteRepository` | Http/Mock |
| register | `RegisterRepository` | Http/Mock |
| request_service | `RequestServiceRepository` | Http/Mock |
| reviews | `ReviewsRepository` | Http/Mock |
| schedule | `ScheduleRepository` | Http/Mock |
| search | `SearchRepository` | Http/Mock |
| security | `SecurityRepository` | Http/Mock |
| service_detail | `ServiceDetailRepository` | Http/Mock |
| settings | `SettingsRepository` | Http/Mock |
| trust | `TrustRepository` | Http/Mock |
| verification | `VerificationRepository` | Http/Mock |
| **tracking** | `TrackingRepository` | **Mock-only, sin condicional** (`MockTrackingRepository()` fijo, sin `Http...` en el filesystem) |

Features **sin repositorio de datos propio** (UI/navegación pura): `app_shell`, `home` (datos inline en `mock_home_data.dart`), `legal`, `login` (usa `AuthRepository` de `core/session`, no un repo de feature), `onboarding`, `select_role`, `splash`.

**24 de 25 repositorios de datos tienen implementación HTTP real.** Esto contradice la creencia (heredada de documentación histórica) de que "todo sigue siendo mock" — sólo `tracking` lo es, por decisión deliberada (ver sección 8).

---

## 6. Autenticación

### 6.1 Componentes (`apps/backend/src/common/auth/`)

- **`jwt.strategy.ts`** — `JwtStrategy extends PassportStrategy(Strategy)` (passport-jwt). Extrae `Bearer` del header (`ExtractJwt.fromAuthHeaderAsBearerToken()`), `ignoreExpiration: false`, secreto = `JWT_ACCESS_SECRET`, valida `issuer`/`audience`. `validate(payload)` devuelve `{ id: payload.sub, role: payload.role }`.
- **`jwt-auth.guard.ts`** — `JwtAuthGuard extends AuthGuard('jwt')`, sobreescribe `handleRequest` para relanzar como la `UnauthorizedException` propia del dominio (no la de Nest), de modo que `DomainExceptionFilter` produzca un `ErrorResponseDto` consistente para cualquier 401.
- **`roles.guard.ts` / `roles.decorator.ts` / `role.enum.ts`** — infraestructura de autorización por rol **construida pero no aplicada a ningún endpoint todavía** (cero usos de `@Roles(...)` fuera de estos archivos base). `Role` enum: `CUSTOMER`, `PROVIDER`, `ADMIN` (Admin reservado; nada lo emite hoy).
- **`current-user.decorator.ts`** — `@CurrentUser()` extrae `request.user` (poblado por `JwtStrategy`).
- **`authenticated-user.interface.ts`** — `{ id: string; role: Role }`.

### 6.2 Roles — derivados, no persistidos

**No existe un campo `role` en `Identity`.** El rol se calcula en cada login/refresh: si existe un `Provider` para esa `Identity` **con `status === ProviderStatus.Active`**, el rol es `Role.Provider`; si no, `Role.Customer` (`login.use-case.ts`, líneas ~94-100). Un `Provider` recién creado queda en `PENDING` (fijado por `CreateProviderUseCase`) y **no otorga el rol Provider** hasta que alguien lo mueva a `ACTIVE` manualmente vía `PUT /providers/:id` — **no existe rol de staff/admin ni panel de aprobación**; es un paso manual vía API directa.

### 6.3 Flujo completo Login/Refresh/Logout

1. **Login** (`login.use-case.ts`): busca `Identity` por `documentNumber` (debe estar `Active`) → busca `Authentication` activo tipo `PASSWORD` → busca `Credential` activo tipo `PASSWORD` con `passwordHash` → verifica con `PasswordHasher.verify` (bcryptjs) → deriva rol desde `Provider` → llama `issueTokenPair`. **Todos los fallos devuelven el mismo mensaje** `"Invalid document number or password"` (anti-enumeración deliberada).
2. **`issueTokenPair`** (compartido por Login y Refresh): firma access+refresh (claims `{ sub: identityId, role }`, `jti` aleatorio por token), calcula `hashRefreshToken` (SHA-256), persiste una fila `RefreshToken` (hash, `expiresAt`, `revokedAt: null`), devuelve `expiresIn` calculado desde el `exp` real del token firmado.
3. **Refresh** (`refresh.use-case.ts`): verifica firma/expiración → busca por hash en `RefreshTokenRepository` → rechaza si no existe/revocado/expirado → **revoca el token presentado inmediatamente** (rotación de un solo uso) → re-resuelve el rol desde el `Provider` actual (no confía en el rol del token viejo) → emite un par nuevo.
4. **Logout** (`logout.use-case.ts`): revoca el refresh token presentado; idempotente (token desconocido o ya revocado → éxito silencioso, sin verificar firma — sólo requiere conocer el hash).

### 6.4 JWT — detalles técnicos

- `jwt-token.service.ts` implementa el puerto `TokenService` usando `@nestjs/jwt`.
- **Secretos separados** para access y refresh.
- `getExpiry()` decodifica sin verificar (uso interno inmediato tras firmar).
- Cualquier error de verificación se traduce a `UnauthorizedException('Invalid or expired token')`.

### 6.5 Password hashing

`bcrypt-password-hasher.ts` — `bcryptjs`, `SALT_ROUNDS = 12`.

### 6.6 `env.validation.ts` y secretos

Variables leídas: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN` (default `900s`), `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` (default `7d`), `JWT_ISSUER` (default `servicios180-api`), `JWT_AUDIENCE` (default `servicios180-clients`), `CORS_ORIGIN` (default `*`).
- **Producción** (`NODE_ENV=production`): faltan los secretos JWT → `throw` al boot (fail-fast).
- **Fuera de producción**: si falta un secreto, se genera uno efímero (`crypto.randomBytes(32).toString('hex')`) en cada boot — los tokens firmados con él dejan de validar tras reiniciar. Nunca hay un literal hardcodeado.

### 6.7 Guards aplicados — estado real por endpoint

**Endpoints públicos** (sin `JwtAuthGuard`): `POST /authentications/login`, `POST /authentications/refresh`, `POST /authentications/logout`, `POST /identities`, `POST /credentials`, `POST /authentications` (create), `GET /docs` (Swagger).

**Todo lo demás está protegido con `JwtAuthGuard`** (19 controllers protegidos a nivel de clase completa; Identity/Credential/Authentication protegidos a nivel de método, excluyendo los públicos de arriba).

**`RolesGuard`/`@Roles(...)` no se aplica a ningún endpoint** — cualquier usuario autenticado (Customer o Provider) puede llamar cualquier endpoint protegido; no hay restricción por rol implementada todavía, aunque la infraestructura para hacerlo ya existe.

---

## 7. Comunicación Cliente-Servidor

Ver también sección 5.3 para el detalle técnico del `ApiClient`. En resumen, el flujo de una petición típica:

1. Un repositorio Http (p. ej. `HttpOrdersRepository`) construye la petición y la pasa por `ApiClient` (instancia única de `Dio`).
2. **`AuthInterceptor`** añade `Authorization: Bearer <accessToken>` automáticamente.
3. Si la petición falla por problema de red/timeout, **`RetryInterceptor`** reintenta hasta 2 veces con backoff creciente — nunca reintenta una respuesta HTTP válida (un 404 no se reintenta).
4. Si el servidor responde 401 (token expirado), **`RefreshInterceptor`** dispara un único refresh (deduplicado si hay peticiones concurrentes) contra `POST /authentications/refresh`, usando un `Dio` limpio sin interceptores para evitar recursión; si el refresh tiene éxito, reintenta automáticamente la petición original con el token nuevo; si falla, notifica `onSessionExpired()` a `SessionManager` (que limpia la sesión y, vía `AppRouteGuard`, redirige a `/login`).
5. **`LoggingInterceptor`** registra toda la actividad (incluidas las reescrituras anteriores) para debugging.
6. Cualquier error final se traduce a una excepción tipada (`http_exceptions.dart`) antes de llegar al repositorio, que sólo maneja `HttpException`, nunca `DioException` directamente.
7. **Secure storage**: los tokens (access y refresh) se persisten exclusivamente vía `flutter_secure_storage` (`SecureTokenStorage`), nunca en `SharedPreferences` ni en memoria persistente sin cifrar.

---

## 8. WebSockets

**Estado: no implementado en absoluto.** Grep exhaustivo (`socket`, `websocket`, `ws://`, `Gateway`, `@WebSocketGateway`, `socket_io`, case-insensitive) sobre todo `apps/backend` y `apps/mobile`:

- Cero implementación real. Ningún `@WebSocketGateway`, ningún import de `socket.io`/`ws`/`socket_io_client`, ninguna URL `ws://`.
- Las únicas menciones son **comentarios de documentación dentro del propio código**, reconociendo explícitamente el gap:
  - `apps/mobile/lib/features/tracking/repositories/tracking_repository.dart` (líneas 9-17): comentario explícito de que el feature "necesita un canal de posición en vivo (WebSocket) ... trabajo de backend Fase 5, no construido todavía", y que `HttpTrackingRepository` **deliberadamente no se crea** "en vez de enviar una implementación HTTP falsa que no puede funcionar realmente".
  - Comentario similar en `mock_chat_repository.dart`.
  - Varios `README.md` de módulo (`chat`, `message`, `notification`) mencionan "socket"/"gateway" sólo como referencia conceptual a trabajo futuro, no construido.

**Decisiones ya tomadas**: no construir una implementación HTTP falsa para tracking que finja tiempo real (se prefiere dejarlo Mock explícitamente documentado antes que simular algo que no funciona).

**Qué falta implementar**: un gateway WebSocket real en el backend (NestJS soporta esto nativamente vía `@nestjs/websockets` + `@nestjs/platform-socket.io`, no instalado aún) para (a) posición en vivo del proveedor durante un servicio en curso (requiere además agregar lat/lng al dominio de `Address`, que hoy no lo tiene) y (b) mensajería de chat push en tiempo real (hoy el chat funciona 100% por REST poll/fetch-on-demand, sin ningún mecanismo de actualización automática verificado en las páginas de chat).

---

## 9. Registro

### 9.1 Registro de cliente (`apps/mobile/lib/features/register/`)

`RegisterPage` + `RegisterForm` + `RegisterValidators` recopilan: nombre completo, tipo de documento (`DocumentType`), número de documento, fecha de nacimiento, contraseña + confirmación.

`HttpRegisterRepository.register()` ejecuta **3 llamadas HTTP secuenciales sin autenticación**, en este orden estricto (cada una depende del id devuelto por la anterior):
1. `POST /identities` → obtiene `id` de la Identity.
2. `POST /credentials` con `{ identityId, type: 'PASSWORD', password }` → hashea y guarda la contraseña.
3. `POST /authentications` con `{ identityId, methodType: 'PASSWORD' }` → crea el registro que `LoginUseCase` exige que exista y esté activo antes de comparar la contraseña.

**No inicia sesión automáticamente** — es `RegisterPage` quien llama `SessionManager.login()` inmediatamente después de que `register()` tenga éxito.

### 9.2 Registro de proveedor (`apps/mobile/lib/features/become_provider/`)

`BecomeProviderPage` (421 líneas) + `DocumentUploadField` + `SelfieCaptureField` recopilan: categoría, especialización, años de experiencia, biografía, ciudad, departamento, zona de cobertura, y dos documentos (antecedentes penales / certificación).

`HttpBecomeProviderRepository.apply()`:
- Obtiene la `Identity` actual.
- `_ensureProfile()` — crea un `Profile` si el usuario todavía no tiene uno (el registro básico sólo crea Identity/Credential/Authentication, no Profile).
- `_saveCoverageAddress()` — crea/actualiza una `Address` tipo `SERVICE` con la zona de cobertura (reutiliza el módulo Address en vez de crear un concepto nuevo).
- **Nota de diseño documentada explícitamente en el código**: `Provider` no tiene campos propios `category`/`specialization`/`city`/`coverage` en el dominio — se insertan como prefijo de texto estructurado dentro de `biography` (dato real, no simulado, pero modelado de forma pragmática/temporal). Una migración de schema para un `categoryId` real en `Provider` queda pendiente.
- `experience` (`beginner`/`intermediate`/`advanced`/`expert`) se deriva de `yearsOfExperience` por umbrales (`<2`→beginner, `<5`→intermediate, `<10`→advanced, resto→expert) — no se pregunta explícitamente en el formulario.
- `type` no se pregunta — siempre `INDEPENDENT` por defecto.
- `POST /providers` — el Provider queda en `ProviderStatus.PENDING` (fijado por el backend).
- Crea dos `Verification` (`POST /verifications`, tipos `CRIMINAL_RECORD` y `CERTIFICATION`).
- `uploadDocument()` sube cada archivo vía `POST /verifications/:id/document` (multipart, con `onSendProgress` para barra de progreso).

### 9.3 Verificación y subida de archivos (backend)

- **`VerificationController.uploadDocument`**: primero confirma que la `Verification` existe (404 si no) **antes** de escribir a disco (evita huérfanos); luego `LocalVerificationDocumentStorageService.save()` escribe el archivo y devuelve la ruta relativa; luego `UploadVerificationDocumentUseCase` persiste esa ruta.
- **`LocalVerificationDocumentStorageService`**: escribe en `uploads/verifications/<verificationId>/<nombre-saneado>` usando `node:fs/promises`. **Disco local, sin integración con almacenamiento en la nube (S3/GCS/Azure Blob)** — limitación real confirmada. Sanea el nombre de archivo (reemplaza `/`/`\`, quita puntos iniciales) para prevenir path traversal.
- **Avatar de perfil**: mismo patrón exacto — `ProfileController.uploadAvatar` + `LocalProfileAvatarStorageService`, escribe en `uploads/profiles/<profileId>/<archivo>`.

### 9.4 Pendientes de registro/verificación

- No hay panel de aprobación (ni backend de "staff" ni UI) para que un administrador revise verificaciones y active providers — el paso `PENDING → ACTIVE` es manual vía `PUT /providers/:id` directo a la API.
- Almacenamiento de archivos en disco local, no apto tal cual para despliegue multi-instancia sin volumen compartido.
- `category`/`specialization`/`city`/`coverage` del proveedor modelados como texto dentro de `biography`, no como columnas propias — deuda de modelado pendiente.

---

## 10. Flujo de negocio (paso a paso, estado real)

1. **Registro** → `POST /identities` + `POST /credentials` + `POST /authentications` (públicos) → `RegisterPage` llama `SessionManager.login()`.
2. **Login** → `POST /authentications/login` → tokens guardados en `SecureTokenStorage`; rol derivado server-side (`Customer` por defecto, sin `Provider` `ACTIVE` no hay otro rol).
3. **Creación de proveedor** → `BecomeProviderPage` → asegura `Profile`, `Address` de cobertura, `POST /providers` (queda `PENDING`), `POST /verifications` x2, `POST /verifications/:id/document` x2. **El Provider queda `PENDING` y su rol efectivo sigue siendo `Customer`** hasta aprobación manual — no hay UI ni backend de aprobación (eslabón incompleto real).
4. **Creación de servicio** (proveedor ya activo) → `POST /services` (verifica Category y Provider existen).
5. **Solicitud de servicio (Order)** → `POST /orders` (verifica Identity, Provider, Service). **Limitación documentada en el código**: el feature `request_service` todavía modela "un solo servicio/proveedor fijo" (toma el primer ítem de `GET /services` en la capa de repositorio, sin selección real por id todavía) — limitación de diseño interino, no un mock.
6. **Cotización** → `POST /quotes` (verifica Order y Provider). Una Order puede recibir **múltiples** Quotes de distintos providers (sin invariante 1:1, confirmado en el dominio).
7. **Aceptación de cotización** → `PUT /quotes/:id/accept`.
8. **Chat** → se abre referenciando Order/cliente/Provider (los tres verificados al crear); 100% REST, sin push en tiempo real (ver sección 8).
9. **Pago** → `POST /payments` (verifica Quote, Order, Identity pagador, Provider receptor). **No hay integración con ninguna pasarela de pago real** (Stripe, PayU, Wompi, etc.) — el módulo Payment sólo persiste el registro de la transacción, no procesa dinero real.
10. **Calificación** → `POST /reviews` (verifica Order, Provider, Identity reviewer). Sin invariante 1:1 Order↔Review.
11. **Finalización de la Order** → **el único endpoint de transición de estado real es `PUT /orders/:id/cancel`.** No existe transición `pending → accepted → in_progress → completed` vía endpoint dedicado (confirmado explícitamente en el comentario de código de `HttpOrdersRepository.acceptOrder()`: *"[acceptOrder] therefore can't persist server-side; it returns [order] unchanged"*). **Esto es un eslabón roto real y documentado**: el ciclo de vida completo de una Order no puede completarse hoy vía API, sólo cancelarse.

---

## 11. Cambios realizados en las últimas sesiones (cronología)

Basado en `git log` real (no en narrativa de documentos). Los commits más recientes, de más antiguo a más reciente dentro de este tramo:

- `0bbe0d5` — Sprint 4, Etapa 7: Autenticación y Autorización Real (JWT).
- `8d298f6` … `b01d41b` — Sprint 4, Etapas 1-6: capa HTTP (Presentation/Controllers) para todos los bounded contexts, módulo por módulo.
- `d0d302a` — Sprint 5, Etapa 2: Migración completa Flutter → Backend (19 módulos restantes conectados a Http en el frontend).
- `ed5ac97` — Sprint 5, Etapa 1: Integración completa Flutter ↔ Backend (infraestructura + 3 pilotos).
- `06f1dd9` — "Release Candidate: Auditoría integral y hardening (Prompt 77)" — según la narrativa de `PROJECT_STATUS.md`, esta auditoría eliminó residuos tipo TODO/stub/placeholder de lógica de negocio real (confirmado: el grep de esta investigación no encontró ninguno).
- `2f6487a` — **Security hardening (JWT guards, CORS/headers) + Flutter dev-connectivity fixes and Apple-style visual redesign.** Aquí se aplicaron `JwtAuthGuard` de forma consistente a los controllers, se agregó CORS configurable y cabeceras de seguridad básicas (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`), y se rediseñó visualmente buena parte de la UI Flutter con un lenguaje "Apple-style".
- `b32ff5a` (**HEAD actual**) — **"Add provider availability, chat list, requests dashboard, verification uploads, and profile/service edit sheets."** Este commit (creado durante esta misma sesión de trabajo, 308 archivos, +12021/-1090) extiende el backend con subida de documentos de verificación y avatares de perfil, agrega el estado `PENDING` de Provider, y trae la app móvil al día con: dark mode, `chat_list_page`, `provider_requests_page` (dashboard de solicitudes del proveedor), hojas de edición (`address_form_sheet`, `contact_form_sheet`, `service_form_sheet`, `edit_profile_sheet`), páginas legales (`legal/`), y scaffolding de tracking (`tracking/`, aún 100% Mock).

**Decisiones tomadas durante esta sesión de trabajo (post-commit, en curso)**:
- Se instaló el entorno de desarrollo completo desde cero en esta máquina Windows (VS Code, Android Studio, Flutter SDK vía clon de `flutter/flutter` en `C:\src\flutter`, Node.js LTS, Docker Desktop + WSL2 habilitado vía DISM tras reinicio).
- Se levantó Postgres 16 en un contenedor Docker (`appservicios-pg`, puerto host `55432`), se aplicaron las 12 migraciones Prisma con `prisma migrate deploy`, y se arrancó el backend (`npm run start:dev`) y la app Flutter para Windows desktop conectada al backend real (`--dart-define=USE_MOCK_BACKEND=false`).
- Se identificó que el intento de probar la app interactivamente vía navegador (Flutter web) no fue viable en este entorno concreto (limitación de compositing de la herramienta de automatización de navegador con contenido renderizado en canvas de Flutter Web) — se decidió que el usuario probará manualmente la app de escritorio y reportará fallos puntuales.
- El usuario solicitó migrar la base de datos de PostgreSQL a **MySQL** (tiene MySQL Workbench como cliente real de producción) — **decisión tomada: preparar la migración pero no ejecutarla todavía**, a la espera del dato de host de conexión (usuario y contraseña ya fueron proporcionados en el chat, ver nota de seguridad en sección 16). El schema fue revisado y es portable a MySQL sin cambios estructurales (no usa tipos ni features exclusivos de Postgres: sin arrays, sin JSON nativo, sin `@db.*` específicos — sólo `String`, `Int`, `Float`, `DateTime`, enums).
- Tras un reinicio de Windows (necesario para completar la activación de WSL2), tanto Docker Desktop como el contenedor Postgres y el proceso del backend quedaron detenidos y tuvieron que reiniciarse manualmente — **esto se repetirá en cada reinicio del equipo** hasta que se automatice (ver recomendaciones, sección 16).

**Bugs encontrados durante esta sesión**: ninguno de lógica de negocio (el grep de TODOs/stubs no arrojó nada — ver sección 12); el único "bug" operativo fue el fallo de compositing del navegador embebido al intentar renderizar Flutter Web, no relacionado con el código del proyecto.

**Bugs corregidos durante esta sesión**: ninguno — esta sesión fue de instalación de entorno, documentación de estado, y preparación de la migración a MySQL; no se tocó lógica de negocio del proyecto.

---

## 12. Problemas conocidos

**Frontend**
- `USE_MOCK_BACKEND` por defecto en `true` — fuente frecuente de confusión ("¿está conectado al backend o no?") si no se pasa el flag explícitamente al compilar/ejecutar.
- `request_service` toma el primer servicio de `GET /services` en vez de permitir selección real por id en la capa de repositorio (limitación de diseño interino).
- Varios `Http*Repository` traen listas completas y filtran client-side por falta de filtros server-side (`quote` por `orderId`, `profile`/`address` por `identityId`, `availability` por `providerId`) — riesgo de escalabilidad con datos reales de producción.
- `tracking` es 100% Mock, sin ninguna vía de conectarse a datos reales hoy (falta lat/lng en `Address` + canal en vivo).

**Backend**
- `HttpOrdersRepository.acceptOrder()` no puede persistir server-side — no existe transición de estado de Order más allá de `cancel` (eslabón crítico roto en el flujo de negocio, ver sección 10, punto 11).
- `RolesGuard` construido pero sin aplicar — sin distinción de permisos Customer/Provider en ningún endpoint protegido.
- Sin `helmet`, sin `trust proxy` configurado, CORS por defecto `*` (abierto) — mitigable en despliegue vía `CORS_ORIGIN`, pero no configurado de forma restrictiva por defecto.
- Sin panel/rol de administrador para aprobar Providers — el paso `PENDING → ACTIVE` es manual vía API directa, sin ninguna UI.

**Arquitectura**
- Inconsistencia estilística real: algunos Use Cases lanzan `NotFoundException` directamente, otros devuelven `null` y dejan que el Controller la lance — no es un bug funcional, pero es deuda de consistencia.
- Duplicación estructural reconocida (según la propia narrativa de `PROJECT_STATUS.md`, Prompt 77) y no corregida: validación repetida en los 21 `*.validator.ts` sin helper compartido; cálculo de paginación repetido en los 22 `prisma-*.repository.ts`; boilerplate `toDomain`/`toPersistence` repetido en los 22 `*-prisma.mapper.ts` sin clase base; 22 `*ViewModel` de Flutter repiten boilerplate de 3 estados sin clase base compartida.

**UX**
- Flujo de aprobación de proveedor invisible para el usuario final (queda "colgado" en `PENDING` sin feedback claro de cuándo o si será aprobado).

**Seguridad**
- CORS abierto (`*`) por defecto.
- Sin `helmet` (cabeceras de seguridad manuales, básicas pero no exhaustivas).
- Archivos subidos (`uploads/`) servidos como estáticos sin guard — una vez se conoce la ruta exacta (devuelta sólo a quien ya pasó el guard al momento de la subida), el archivo es de acceso libre sin autenticación adicional.
- `RolesGuard` sin aplicar — cualquier usuario autenticado puede invocar cualquier endpoint protegido, sin distinción de rol.

**Performance**
- Filtrado client-side en vez de server-side en varios listados (ver Frontend arriba) — no escalará bien con volúmenes de datos de producción reales.

**Responsive**
- No se auditó específicamente en esta sesión (fuera del alcance de la investigación realizada); no se encontró evidencia de problemas ni de que se haya verificado exhaustivamente en múltiples tamaños de pantalla más allá de lo que las pruebas de widget (`*_responsive_test.dart`, presentes para varias features) cubren.

**Datos simulados**
- Sólo `tracking` es Mock-only de forma permanente y documentada. El resto de features Mock lo son sólo si se compila con `USE_MOCK_BACKEND=true` (el default).

**TODOs**
- Grep exhaustivo de `TODO`, `FIXME`, "not implemented", "Not implemented yet", stub, placeholder sobre todo `apps/backend/src` y `apps/mobile/lib`: **cero resultados** en ambos árboles (consistente con la auditoría del Prompt 77 mencionada en `PROJECT_STATUS.md`).

---

## 13. Próximos pasos (por prioridad)

1. **Cerrar el ciclo de vida de `Order`** (backend): agregar Use Cases/endpoints para las transiciones `PENDING → ACCEPTED → IN_PROGRESS → COMPLETED` (hoy sólo existe `cancel`). Depende de: ninguno — es el bloqueador más directo para completar el flujo de negocio end-to-end descrito en la sección 10.
2. **Definir y construir el flujo de aprobación de Providers**: alguna forma de rol/panel de staff (aunque sea mínimo) para revisar verificaciones y mover `PENDING → ACTIVE`, en vez del `PUT /providers/:id` manual actual. Depende de: decidir si se modela como un nuevo rol `ADMIN` real (la infraestructura de `Role.ADMIN` y `RolesGuard` ya existe, sólo falta aplicarla) o un proceso externo al sistema.
3. **Aplicar `RolesGuard`/`@Roles()` a los endpoints que lo necesiten** (p. ej., sólo un Provider debería poder cotizar, sólo el dueño de una Order debería poder cancelarla) — depende de: que el punto 2 haya definido claramente los roles reales a distinguir.
4. **WebSockets para chat y tracking** — depende de: decidir la arquitectura de tiempo real (Nest Gateway + Socket.IO es la ruta más directa dado que ya se usa NestJS); tracking además depende de agregar lat/lng al dominio `Address`.
5. **Integración de pasarela de pago real** (Stripe/PayU/Wompi u otra) — depende de: decisión de negocio sobre qué proveedor de pagos usar en el mercado objetivo (Colombia, a juzgar por el idioma y el estilo de datos).
6. **Filtros server-side en los listados que hoy se filtran client-side** (`quotes?orderId=`, `messages?chatId=`, etc.) — depende de: ninguno, es trabajo incremental por módulo, recomendable antes de cualquier prueba de carga real.
7. **Migración de almacenamiento de archivos de disco local a almacenamiento en la nube** (S3/GCS/Azure Blob) — depende de: decisión de proveedor cloud, relevante sobre todo si el despliegue final será multi-instancia.
8. **Migración de PostgreSQL a MySQL** — en preparación (ver sección 16), pendiente sólo del dato de host de conexión.
9. **Reducir duplicación estructural** (validadores, mappers Prisma, paginación, ViewModels) con clases base compartidas — mejora de mantenibilidad, no bloqueante funcionalmente.
10. **Restringir CORS y agregar `helmet`** antes de cualquier despliegue a un entorno accesible públicamente — bloqueante de seguridad para producción, no para desarrollo.

---

## 14. Estado real del proyecto (porcentajes estimados)

> Estimaciones basadas en la evidencia concreta reunida en este documento (endpoints existentes, repositorios Http vs Mock, ausencia de pruebas de integración end-to-end reales ejecutadas contra el backend real durante esta sesión). No son una métrica formal certificada, sino una estimación razonada para orientar prioridades.

- **Backend**: ~85% completo para el alcance de negocio actual. Los 22 módulos están completos en las 4 capas con persistencia real; falta el ciclo de vida completo de `Order`, aplicar `RolesGuard`, WebSockets, y endurecer seguridad (CORS/helmet) para producción.
- **Frontend**: ~80% completo. 24/25 repositorios con implementación HTTP real, navegación con guard funcional, sesión y refresco de tokens robustos; falta tracking real, algunos flujos con selección "primer ítem" en vez de selección real (`request_service`), y pulido de UX para el estado `PENDING` de proveedores.
- **Integración (frontend↔backend real, no mocks)**: ~70%. La conectividad técnica está probada (esta sesión verificó login/backend/DB funcionando end-to-end a nivel de infraestructura), pero **no se ejecutaron pruebas manuales interactivas de cada flujo de negocio contra el backend real durante esta sesión** (limitación de herramienta de automatización de navegador para Flutter Web, documentada en la sección 11) — queda pendiente que el usuario valide manualmente cada pantalla con la app de escritorio ya conectada al backend real.
- **QA**: Existen specs unitarios/de integración por módulo backend (`*.spec.ts`) y tests de widget/navegación en Flutter (`test/features/**/*_test.ts`), pero no se ejecutó la suite completa de tests durante esta sesión ni se corrió una prueba end-to-end manual del flujo de negocio completo — el QA formal de flujo completo está pendiente.
- **Producción**: ~20%. Falta contenedorización propia del backend/frontend (sin `Dockerfile`), sin `docker-compose.yml`, sin CI/CD configurado (no se encontró evidencia de pipelines en esta investigación), CORS abierto y sin `helmet`, sin pasarela de pago real, sin base de datos de producción definitiva (migración a MySQL en curso).

---

## 15. Estado de Git

**Últimos commits** (`git log --oneline`, del más reciente hacia atrás):
```
b32ff5a Add provider availability, chat list, requests dashboard, verification uploads, and profile/service edit sheets
2f6487a Security hardening (JWT guards, CORS/headers) + Flutter dev-connectivity fixes and Apple-style visual redesign
06f1dd9 Release Candidate: Auditoria integral y hardening (Prompt 77)
d0d302a Sprint 5, Etapa 2: Migracion completa Flutter -> Backend (19 modulos restantes)
ed5ac97 Sprint 5, Etapa 1: Integracion completa Flutter <-> Backend (infra + 3 pilotos)
0bbe0d5 Sprint 4, Etapa 7: Autenticación y Autorización Real (JWT)
... (historial completo remonta hasta el Prompt 30, ver `git log` para el detalle completo)
```

**Commit HEAD (`b32ff5a`)**: autor `Angelo Lizarazo Cruz <lizarazocruzangelo@gmail.com>`, 308 archivos modificados, +12021/-1090 líneas. Creado durante esta misma sesión de trabajo (el repositorio no tenía identidad git configurada localmente; se configuró `user.name`/`user.email` sólo para este repositorio, no global, con los datos confirmados por el usuario).

**Trabajo sin commitear**: **ninguno** — `git status` devuelve `nothing to commit, working tree clean` y `git diff --stat` no produce salida. Todo el trabajo de la sesión anterior (provider availability, chat list, requests dashboard, verification uploads, profile/service edit sheets) ya quedó consolidado en `b32ff5a`.

**Nota importante de discrepancia documental**: `PROJECT_STATUS.md` (4622 líneas) narra el proyecto hasta el commit `06f1dd9` y sus notas finales describen un estado "pendiente de aprobación, sin commitear" que **ya fue consolidado** en los commits `2f6487a` y `b32ff5a` posteriores. **Quien continúe el proyecto no debe confiar ciegamente en la narrativa de `PROJECT_STATUS.md`/`SPRINT3_PREPARATION.md` para el estado más reciente** — siempre verificar contra `git log` y el código directamente, como se hizo para este documento.

**Nota sobre archivos accesorios en el commit**: se coló un artefacto de build (`apps/mobile/android/build/reports/problems/problems-report.html`) en el commit `b32ff5a` — no debería estar versionado; se recomienda limpiarlo en un commit aparte y agregar `apps/mobile/android/build/` al `.gitignore` si no está ya cubierto por un patrón más general.

---

## 16. Recomendaciones

**Qué hacer inmediatamente después**:
1. Completar el ciclo de vida de `Order` (transiciones de estado más allá de `cancel`) — es el bloqueador más concreto para poder decir que el flujo de negocio "funciona de punta a punta" con datos reales.
2. Definir el mecanismo de aprobación de Providers (aunque sea manual pero con una pantalla mínima de staff) antes de exponer el registro de proveedores a usuarios reales — hoy un proveedor que se registra no tiene ninguna visibilidad de su estado `PENDING` ni forma de saber cuándo será aprobado.
3. Terminar y ejecutar la migración a MySQL (ver nota de seguridad abajo) mientras el volumen de datos todavía es de prueba — es mucho más barato migrar el motor de base de datos ahora que después de tener datos de producción reales.
4. Ejecutar manualmente (el usuario, con la app ya conectada al backend real) cada flujo de negocio descrito en la sección 10, para confirmar en la práctica lo que este documento confirma sólo a nivel de código estático.

**Riesgos existentes**:
- **CORS abierto (`*`) y ausencia de `helmet`** — aceptable en desarrollo, pero es un riesgo real si el backend llegara a exponerse públicamente sin restringir esto primero.
- **Archivos subidos servidos sin guard adicional** — cualquiera con la URL exacta de un archivo puede acceder a él sin autenticación; aceptable si las URLs no son adivinables (usan IDs), pero vale la pena revisar antes de producción.
- **Sin distinción de permisos por rol** (`RolesGuard` sin aplicar) — cualquier usuario autenticado puede, por ejemplo, cancelar cualquier Order o crear un servicio a nombre de cualquier Provider si conoce sus IDs — riesgo real de integridad de datos, no sólo teórico.
- **Dependencia de Docker Desktop + WSL2 en desarrollo local en Windows** — cada reinicio del equipo requiere relanzar Docker Desktop y el contenedor de Postgres manualmente (confirmado en esta misma sesión) hasta que se automatice (p. ej., configurando el contenedor con `--restart unless-stopped`, o creando un script de arranque).

**Deuda técnica existente**:
- Duplicación de validadores, mappers Prisma, cálculo de paginación, y ViewModels de Flutter (ver sección 12) — no bloqueante, pero crece con cada módulo nuevo si no se aborda con clases base compartidas.
- Modelado de `category`/`specialization`/`city`/`coverage` del Provider como texto libre dentro de `biography` en vez de columnas propias.
- Actualización pendiente de Prisma 5.22.0 → 7.9.1 (major version, requiere revisión de breaking changes antes de actualizar).

**Qué NO debería modificarse sin cuidado extra**:
- El mecanismo de derivación de rol (`Customer`/`Provider` calculado desde `Provider.status` en cada login/refresh) — es una decisión arquitectónica central de la que dependen `AppRouteGuard`, la UI condicional cliente/proveedor, y (potencialmente) cualquier futuro uso de `RolesGuard`. Cambiarlo a un campo persistido requeriría migrar tokens ya emitidos y reconsiderar el flujo de aprobación de providers.
- La rotación de refresh tokens de un solo uso — es lo que hace segura la sesión persistente; relajar esto (p. ej., permitir reutilizar un refresh token) reintroduciría una vulnerabilidad clásica de robo de tokens.
- El patrón Mock/Http intercambiable vía `ApiConfig.useMockBackend` — es valioso para desarrollo de UI sin depender del backend; no debería eliminarse aunque se cambie el default a `false`.

**Nota de seguridad sobre la migración a MySQL (en curso, no completada)**: el usuario proporcionó usuario y contraseña de su servidor MySQL directamente en el chat de esta sesión, y la migración quedó pendiente únicamente del dato de **host** de conexión. Antes de completarla, se recomienda: (a) nunca commitear esas credenciales — deben vivir sólo en `apps/backend/.env` (ya gitignored); (b) considerar rotar esa contraseña si el servidor MySQL es compartido o de terceros, dado que transitó por un canal de chat; (c) una vez recibido el host, los pasos técnicos son: cambiar `datasource db { provider = "mysql" }` en `schema.prisma`, actualizar `DATABASE_URL` a formato `mysql://usuario:contraseña@host:puerto/appservicios`, eliminar las migraciones actuales (con SQL específico de Postgres, incompatibles con MySQL) y regenerar una migración inicial fresca contra MySQL con `prisma migrate dev --name init`, y regenerar el Prisma Client (`npx prisma generate`). El schema actual es portable sin cambios estructurales (sin arrays, sin JSON nativo, sin tipos `@db.*` específicos de Postgres).

---

*Fin del documento. Generado a partir de investigación de código en vivo — cualquier cambio posterior en el repositorio puede volver desactualizadas secciones puntuales; verificar siempre contra `git log` y el código antes de tomar decisiones críticas basadas únicamente en este documento.*
