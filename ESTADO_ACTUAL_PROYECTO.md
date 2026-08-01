# SERVICIOS 180° — Estado Actual del Proyecto

**Última actualización:** 31 de julio de 2026
**Fase:** Alpha Online (Etapa 12 completada)
**Repositorio:** https://github.com/teamempresa180/appservicios180
**Backend público:** https://appservicios180-production.up.railway.app

> Este documento refleja el estado **real y verificado** del código y la infraestructura al momento de escribirlo — no es una proyección ni un plan, es una fotografía de lo que existe hoy, verificado contra el código, los tests y el despliegue en producción.

---

## 1. Qué es SERVICIOS 180°

Una app de marketplace de servicios para el hogar (tipo "Uber de servicios domésticos"): conecta **Clientes** que necesitan un servicio (plomería, electricidad, limpieza, jardinería, pintura, mascotas, tecnología, belleza) con **Proveedores** que los ofrecen. Un mismo usuario puede alternar entre ambos roles desde la misma cuenta.

Dos formas de contratar:
- **Contratación directa**: el cliente elige un proveedor y un servicio específico de su catálogo.
- **Solicitud abierta**: el cliente elige solo una categoría; cualquier proveedor compatible puede enviar una cotización. Al aceptar una cotización, el proveedor queda asignado automáticamente.

---

## 2. Arquitectura general

```
┌─────────────────────┐        HTTPS/JSON + JWT        ┌──────────────────────┐
│   App Flutter         │ ──────────────────────────────▶ │  Backend NestJS       │
│  (Android, APK)       │ ◀────────────────────────────── │  (Railway, público)  │
└─────────────────────┘                                  └──────────┬───────────┘
                                                                     │ Prisma ORM
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │  MySQL (remoto,       │
                                                          │  hosting compartido)  │
                                                          └──────────────────────┘
```

- **Backend**: NestJS 11 + TypeScript + Prisma 5 + MySQL, arquitectura por capas (Clean Architecture / DDD) en 22 módulos de negocio.
- **Frontend**: Flutter 3.44 (Dart 3.12), arquitectura por features con patrón Repository, inyección de dependencias vía `get_it`, cada feature puede resolver una implementación **Mock** (offline, para pruebas) o **Http** (backend real) — controlado por un solo flag central.
- **Base de datos**: MySQL real, alojada en un hosting compartido externo (no en Railway ni en el PC del desarrollador), accesible desde internet.
- **Despliegue**: backend en Railway (HTTPS automático, deploy desde GitHub), MySQL en su propio hosting.

---

## 3. Backend (NestJS)

### 3.1 Estilo arquitectónico

Cada uno de los 22 módulos sigue el mismo patrón en 4 capas:

```
modules/<módulo>/
├── domain/           → Entidades, Value Objects, interfaces de repositorio (sin dependencias externas)
├── application/       → Casos de uso, comandos, DTOs internos, mappers
├── infrastructure/     → Implementación real con Prisma (persistencia)
└── presentation/       → Controladores REST, DTOs HTTP, rutas, Swagger
```

Reglas seguidas consistentemente: el dominio nunca importa de Prisma; los casos de uso reciben dependencias por interfaz (permite tests con repositorios en memoria); cada entidad de dominio es inmutable con un método `.with(...)` para crear copias modificadas.

### 3.2 Módulos existentes (22)

| Módulo | Qué modela |
|---|---|
| identity | Cuenta base de la persona (nombre, documento, fecha de nacimiento, estado) |
| authentication | Login, refresh token, logout — métodos de autenticación asociados a una identidad |
| credentials | Contraseñas (hasheadas), tipo de credencial |
| profiles | Perfil público (nombre a mostrar, bio, avatar, visibilidad) |
| contact | Teléfonos/emails de contacto |
| address | Direcciones físicas del cliente |
| verification | Documentos de verificación (para convertirse en proveedor) |
| trust | Nivel de confianza/reputación |
| audit | Registro de auditoría de acciones |
| category | Categorías de servicio (Plomería, Electricidad, etc.) |
| service | Servicios específicos publicados por un proveedor |
| provider | Perfil de proveedor: categoría, especialización, estado de aprobación |
| availability | Disponibilidad horaria del proveedor |
| schedule | Agenda de trabajos programados |
| order | La solicitud/orden de servicio — el corazón del negocio |
| quote | Cotizaciones que un proveedor envía sobre una orden |
| payment | Registro de pagos (sin pasarela de pago real conectada aún) |
| review | Calificaciones y reseñas |
| chat | Conversaciones cliente-proveedor ligadas a una orden |
| message | Mensajes dentro de un chat |
| notification | Notificaciones dentro de la app |
| attachment | Archivos adjuntos a un mensaje |

### 3.3 Modelo de datos clave: `Order`

```
Order {
  identityId       → quién la pidió (cliente)
  categoryId       → siempre presente
  providerId?      → null si es solicitud abierta, presente si es contratación directa
  serviceId?       → igual que providerId, ambos nulos o ambos presentes
  addressId?       → dirección del cliente (agregado en Etapa 12, para navegación)
  status           → Pending → Accepted → InProgress → Completed (o Cancelled/Rejected)
  priority
}
```

Al aceptar una cotización de una solicitud abierta, `providerId` se asigna automáticamente — sin pasos manuales ni lógica duplicada.

### 3.4 Autenticación y seguridad

- JWT de acceso (corta duración) + refresh token (rotación), algoritmo HS256 explícitamente fijado.
- El **rol** (Cliente/Proveedor) no se guarda como campo — se deriva en cada login: si existe un `Provider` en estado `Active` para esa identidad, el rol es Proveedor; si no, Cliente.
- Rate limiting global (100 req/min) + límite más estricto en login (5/min) para frenar fuerza bruta.
- CORS configurable por variable de entorno (hoy `*`, aceptable porque la app usa Bearer token, no cookies — sin riesgo CSRF).
- Cabeceras de seguridad básicas (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Formato de error único en toda la API: `{statusCode, error, message, timestamp, path}` — nunca se filtra un stack trace o mensaje interno de la base de datos al cliente (se corrigió una fuga real en la Etapa 10).
- Secretos JWT: en producción son **obligatorios** (la app falla al iniciar si faltan) — nunca hay un valor por defecto real hardcodeado.
- Estados de proveedor: `Pending → InReview → Active` (o `Rejected/Suspended/Blocked/Inactive/Archived`) — solo `Active` otorga el rol de Proveedor y acceso a las funciones reales del panel.

### 3.5 Base de datos: MySQL real

- Migrado desde PostgreSQL (Etapa 10) a MySQL real, hosting compartido externo, accesible desde internet.
- Como el hosting no permite crear una "shadow database" (requisito técnico de Prisma para generar migraciones automáticamente), el flujo de migraciones es: `prisma db push` para aplicar cambios + generación manual de un archivo de migración con `prisma migrate diff`, marcado como aplicado. Funciona igual de bien, solo requiere un paso manual extra por cambio de esquema.
- 8 categorías reales sembradas (Plomería, Electricidad, Limpieza, Jardinería, Pintura, Mascotas, Tecnología, Belleza).

### 3.6 Estado de los tests (backend)

**183 suites, 920 tests — 100% en verde.** Incluye tests unitarios de dominio, casos de uso, mappers de persistencia, y specs de integración/e2e (excluidos del run rápido por defecto, requieren base de datos).

---

## 4. Frontend (Flutter)

### 4.1 Estilo arquitectónico

```
lib/features/<feature>/
├── entities / models          → Tipos de dominio propios del feature
├── repositories/
│   ├── <feature>_repository.dart       → Interfaz abstracta
│   ├── mock_<feature>_repository.dart  → Datos falsos en memoria (offline)
│   └── http_<feature>_repository.dart  → Llamadas reales al backend
├── presentation/
│   ├── pages/          → Pantallas
│   ├── widgets/         → Componentes visuales
│   └── view_models/     → Estado + lógica (ChangeNotifier)
```

Un solo interruptor central (`ApiConfig.useMockBackend`, definido en tiempo de compilación) decide si **toda** la app usa datos falsos o el backend real — no hay mezcla parcial.

### 4.2 Pantallas/features existentes (32)

Onboarding y cuenta: `splash`, `onboarding`, `login`, `register`, `select_role`, `security`, `settings`, `profile`, `notifications`, `legal`.

Descubrimiento y solicitud (cliente): `home`, `categories`, `marketplace`, `search`, `service_detail`, `request_service`, `address_management`, `contact_management`.

Ciclo de vida del servicio (ambos roles): `orders`, `quote`, `tracking`, `reviews`, `chat`.

Lado proveedor: `provider_dashboard`, `provider_profile`, `provider_services`, `become_provider`, `verification`, `availability`, `schedule`, `trust`, `payments`.

Navegación principal: `app_shell` (bottom navigation adaptable según rol, drawer lateral con el cambio Cliente↔Proveedor estilo inDrive).

### 4.3 Experiencia guiada por estado ("Journey")

Un módulo compartido (`lib/order/journey/`) deriva, de forma pura (sin red, 100% testeable), en qué etapa está una orden y qué acciones tiene sentido mostrar — distinto para cliente y para proveedor. Alimenta un widget de línea de tiempo reutilizable (`OrderProgress`) usado en toda la app en vez de tener lógica de estados duplicada por pantalla.

### 4.4 Preparación para Google Maps y navegación externa

- SDK de Google Maps for Android ya integrado (mapa en Home, tanto para cliente como proveedor).
- Módulo `tracking` preparado (modelos, widget de mapa) pero **deliberadamente sin conectar a un backend real todavía** — solo datos simulados. El seguimiento en vivo del proveedor es la siguiente etapa, no esta.
- Botón **"Iniciar navegación"** (nuevo en Etapa 12): al aceptar un servicio, el proveedor puede abrir Google Maps o Waze con la ruta calculada desde su ubicación actual hasta la dirección del cliente. No es un sistema de navegación propio — abre la app externa ya instalada en el teléfono.

### 4.5 Estado de los tests (frontend)

**828 tests — 100% en verde.** `flutter analyze` limpio (solo sugerencias de estilo, cero errores/advertencias reales).

---

## 5. Infraestructura y despliegue

| Componente | Dónde vive | Notas |
|---|---|---|
| Backend | Railway | HTTPS automático, redeploy en cada push a `main` |
| Código fuente | GitHub (`teamempresa180/appservicios180`) | Subido por primera vez en Etapa 12 |
| Base de datos | MySQL en hosting externo | La misma desde la Etapa 10, accesible desde internet |
| Variables de entorno | Configuradas en Railway (no en el código) | JWT secrets generados aleatoriamente, nunca hardcodeados |
| Certificado de firma Android | `upload-keystore.jks` (no versionado) | Estable desde la Etapa 9 — mismo SHA-256 en cada APK |

### Cómo se compila el APK

```
flutter build apk --release \
  --dart-define=API_BASE_URL=https://appservicios180-production.up.railway.app \
  --dart-define=USE_MOCK_BACKEND=false
```

Cambiar de entorno (dev/alpha/producción) es cuestión del comando de build, nunca de tocar código — pero sí implica recompilar (`--dart-define` se resuelve en tiempo de compilación, no hay `.env` en tiempo de ejecución para una app ya instalada).

---

## 6. Lo que SÍ funciona hoy, de punta a punta, verificado con datos reales

- Registro e inicio de sesión reales contra la base MySQL real.
- Recuperación de sesión (token persistido, refresh automático).
- Explorar categorías → ver proveedores compatibles → contratar directo o publicar solicitud abierta.
- El proveedor ve **solo** las solicitudes relevantes a su categoría (no todas las órdenes del sistema).
- Envío y comparación de cotizaciones, aceptación (con confirmación), asignación automática del proveedor.
- Chat cliente-proveedor ligado a la orden.
- Ciclo completo de la orden: aceptada → en progreso → finalizada → calificación → el proveedor ve su calificación.
- Botón "Iniciar navegación" con Google Maps/Waze.
- Perfil, Configuración, Seguridad — funcionando para cuentas reales (bug de perfil faltante corregido en Etapa 12).

---

## 7. Lo que falta o está deliberadamente fuera de alcance por ahora

| Pendiente | Estado |
|---|---|
| Seguimiento en tiempo real del proveedor en el mapa | Arquitectura preparada, sin conectar — próxima etapa explícita |
| Pagos reales (pasarela de pago) | Módulo `payment` existe en el dominio, sin integración con ningún proveedor de pagos |
| Notificaciones push | No implementado |
| Subir fotos a una solicitud de servicio | Backend no tiene relación Order↔Attachment; hoy el botón muestra honestamente "próximamente" en vez de fingir que funciona |
| Autenticación biométrica / reconocimiento facial | Explícitamente excluido hasta ahora |
| Funciones de IA | Explícitamente excluidas hasta ahora |
| Panel de administración para aprobar proveedores | No existe interfaz — la aprobación de `ProviderStatus` se hace hoy directo en base de datos |
| CI/CD automatizado | El despliegue se dispara por push a GitHub, pero se verificó manualmente esta sesión (ver incidente abajo) |
| `GET /providers` sin filtro por identidad | Cada "proveedor actual" se resuelve trayendo la lista completa y filtrando en el cliente — funciona, pero no escala bien; se recomienda un endpoint `?identityId=` o `/me` |
| Google Maps API key | Generada y en uso, pendiente de que el usuario confirme las restricciones (SHA-1 / package name / facturación) en Google Cloud Console para que el mapa deje de verse en blanco |

---

## 8. Historial de etapas (resumen)

| Etapa | Qué se hizo |
|---|---|
| 1–6 | Construcción del dominio base: identidad, autenticación, perfiles, categorías, servicios, proveedores (ya consolidado antes de este documento) |
| 7 | Endurecimiento para uso comercial: estados de aprobación de proveedor, autenticación reforzada |
| 8 | Flujo de negocio completo cliente↔proveedor conectado de punta a punta |
| 8 (experiencia guiada) | Módulo `OrderProgress`/Journey, Home y Dashboard inteligentes según el estado real de la orden |
| 9 | QA funcional y visual de toda la app, generación de keystore estable, primer APK de pruebas |
| 10 | Migración de PostgreSQL a MySQL real, hardening técnico del backend (logging, formato de error, seguridad, índices), auditoría de la capa de red del frontend |
| 11 | QA completo "Alpha Ready": corrección de un bug crítico de aislamiento entre proveedores, botones muertos, navegación rota, cancelación de requests HTTP, pantalla de reseñas huérfana |
| 12 | Despliegue público en Railway con HTTPS, preparación de Google Maps y navegación externa, corrección de bugs reales descubiertos en el primer dispositivo físico real (perfil faltante, categorías vacías, y un bug de despliegue preexistente: el script de arranque apuntaba a la ruta de compilación equivocada) |

---

## 9. Incidente relevante de esta etapa (para que quede documentado)

Durante las primeras pruebas reales en un teléfono físico se encontraron y corrigieron, en vivo:

1. El registro no creaba un Perfil → Perfil y Configuración fallaban para cualquier cuenta real.
2. La base de datos real no tenía categorías sembradas → Home y Buscar aparecían vacíos.
3. 19 pantallas no manejaban errores no-HTTP → quedaban cargando indefinidamente en vez de mostrar un error.
4. El backend se cayó dos veces durante el proceso (~15 minutos de indisponibilidad en total) por un bug real y preexistente en `package.json`: el comando de arranque de producción apuntaba a `dist/main.js`, pero la compilación real genera `dist/src/main.js` (por un archivo fuera de `src/`). Nunca se había detectado porque el desarrollo local siempre usó el modo de recarga en caliente, que no pasa por el código compilado. Corregido y verificado.

Todo lo anterior ya está corregido, verificado (tests + build) y desplegado.
