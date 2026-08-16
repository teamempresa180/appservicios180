# Pruebas de carga k6 — SERVICIOS 180°

Batería de pruebas de rendimiento para el backend real (NestJS + Prisma + MySQL, desplegado en Railway). Todo aquí corre contra la API real — no hay mocks ni stubs — usando datos de prueba dedicados, reutilizables y fácilmente identificables (prefijo `K6TEST-`).

## Requisitos

- [k6](https://k6.io/docs/getting-started/installation/) instalado (`k6 version`).
- Node.js (ya lo necesitas para el backend).
- `apps/backend/.env` con un `DATABASE_URL` válido, o la variable exportada en el entorno.

## Estructura

```
apps/tests/k6/
  config/         Configuración centralizada: URL base, thresholds, perfiles de carga por tipo de prueba
  helpers/        http, auth (login + cache por VU), métricas, checks, paginación (think-time), reportes
  data/           Carga de fixtures.json (SharedArray) + selectores randomClient/vuClient/etc.
  fixtures/       seed.js / teardown.js — provisión y limpieza de datos de prueba (Node + Prisma directo)
  scenarios/      Un módulo por dominio: health, auth, marketplace, providers, orders, quotes, chat,
                  notifications, reviews, payments — cada uno exporta funciones reutilizables, no scripts sueltos
  tests/          Los 5 tipos de prueba: smoke, load, stress, spike, soak — cada uno compone los
                  escenarios anteriores con un perfil de concurrencia distinto
  reports/        Salida generada (JSON + CSV + HTML por corrida, más latest-<tipo>.{json,html})
```

## 1. Preparar los datos de prueba (obligatorio, una vez)

```bash
cd apps/backend
npm run k6:seed
```

Esto crea (o reutiliza si ya existen, es idempotente por `documentNumber`):

- 1 Categoría dedicada (`K6-LOADTEST Category`)
- 20 Identities cliente, cada una con Credential + Authentication + Profile + Address reales
- 5 Identities proveedor, cada una con Provider **ya en estado `ACTIVE`** + 2 Services reales

**¿Por qué se crean directo con Prisma en vez de vía la API?** Los proveedores necesitan estar `ACTIVE` para poder cotizar, y la Etapa 19 (auditoría funcional) confirmó que hoy no existe ningún mecanismo real de aprobación vía la API pública — `Role.Admin` nunca lo emite nada. Sembrar directo es la única forma de tener proveedores utilizables para las pruebas sin depender de ese gap funcional (que es un hallazgo de producto, no algo que esta etapa deba resolver).

Ajusta el tamaño del pool si lo necesitas:

```bash
K6_SEED_CLIENTS=50 K6_SEED_PROVIDERS=10 npm run k6:seed
```

Al terminar de probar, limpia todo lo generado (fixtures + cualquier Order/Quote/Chat/Message/Review/Payment que las pruebas hayan creado):

```bash
npm run k6:teardown
```

`teardown.js` solo toca filas trazables a una Identity `K6TEST-*` o al texto `K6-LOADTEST` — nunca un usuario ni un dato real.

## 2. Ejecutar las pruebas

Desde `apps/backend`:

```bash
npm run k6:smoke    # ~30s — valida que todo responde correctamente, un VU, un pase
npm run k6:load     # ~3min — carga esperada, concurrencia moderada y sostenida
npm run k6:stress   # ~6min — sube por etapas hasta encontrar el límite
npm run k6:spike    # ~2min — salto brusco de concurrencia y recuperación
npm run k6:soak     # duración configurable (default 10min) — carga constante, detecta degradación
npm run k6:all       # las 5 en secuencia
```

Cada corrida imprime un resumen en consola y escribe:

- `reports/<tipo>-<timestamp>.json` / `.csv` / `.html`
- `reports/latest-<tipo>.json` / `.html` (siempre el más reciente)

## 3. Sobre el límite global por IP

El backend aplica un límite global de **100 requests/60s por IP** (`ThrottlerModule`, Etapa 18) — una medida de seguridad real e intencional, no un descuido. k6 (como cualquier generador de carga de una sola máquina) envía **todo** el tráfico desde una única IP, a diferencia de usuarios reales que llegan desde miles de IPs distintas. Esto significa:

- Los perfiles de carga por defecto de este suite están calibrados **por debajo** de ese límite agregado, específicamente para que `k6:load` mida el backend real y no el limitador.
- El escenario `auth_login` es la única excepción deliberada: no tiene *think-time*, precisamente para exhibir el comportamiento del throttle de login (`5 req/60s`) bajo concurrencia — un error alto ahí, con **una sola VU falsificando muchos inicios de sesión distintos por segundo**, es el resultado esperado, no un bug.
- `k6:stress` y `k6:spike` suben deliberadamente la concurrencia total por encima de ese límite agregado — el "límite" que van a encontrar primero es, casi con certeza, el throttle global de IP, no la base de datos ni Railway. Esto es un hallazgo real y válido (ver el informe de la Etapa 20), pero significa que **estas pruebas, corridas desde una sola máquina, no pueden por sí solas revelar la capacidad de MySQL/Railway más allá de ese punto**.

Para medir la capacidad real más allá del limitador (recomendado antes de un piloto grande), se necesita alguna de estas dos cosas, deliberadamente fuera del alcance de esta entrega:

1. Ejecutar k6 en modo distribuido (k6 Cloud, o varios runners con IPs distintas), o
2. Levantar una réplica de staging con el throttle temporalmente relajado, ejecutar ahí la prueba de capacidad, y nunca contra producción.

## 4. Variables de entorno relevantes

| Variable | Default | Qué controla |
|---|---|---|
| `K6_BASE_URL` | Railway público | Contra qué backend correr |
| `K6_SEED_CLIENTS` / `K6_SEED_PROVIDERS` | 20 / 5 | Tamaño del pool de fixtures |
| `K6_MIN_THINK_SECONDS` / `K6_MAX_THINK_SECONDS` | 1 / 3 | Pausa entre iteraciones (todo excepto `auth_login`) |
| `K6_LOAD_READ_VUS` / `K6_LOAD_WRITE_VUS` / `K6_LOAD_DURATION` | 3 / 1 / 2m | Perfil de `k6:load` |
| `K6_STRESS_PEAK_VUS` / `K6_STRESS_PEAK_WRITE_VUS` / `K6_STRESS_STAGE_DURATION` | 40 / 15 / 1m | Perfil de `k6:stress` |
| `K6_SPIKE_BASE_VUS` / `K6_SPIKE_PEAK_VUS` / `K6_SPIKE_DURATION` / `K6_SPIKE_RECOVERY` | 5 / 60 / 30s / 1m | Perfil de `k6:spike` |
| `K6_SOAK_VUS` / `K6_SOAK_DURATION` / `K6_SOAK_HEALTH_INTERVAL` | 6 / 10m / 10s | Perfil de `k6:soak` |
| `K6_READ_P95_MS` / `K6_WRITE_P95_MS` / `K6_AUTH_P95_MS` | 800 / 2500 / 3500 | Umbrales de latencia por tipo de endpoint |
| `K6_MAX_ERROR_RATE` | 0.01 | Umbral global de tasa de error |

Todas se pasan con `-e` a k6 o como variables de entorno antes del comando `npm run k6:*`.

## 5. Escenarios cubiertos

| Dominio | Lecturas | Escrituras |
|---|---|---|
| Health | `GET /health` (con verificación real de conectividad a MySQL) | — |
| Auth | `GET /authentications/me` | `POST /authentications/login` (concurrente, sin think-time) |
| Marketplace | categorías, proveedores, servicios, detalle de proveedor | — |
| Provider | perfil propio, servicios, disponibilidad, agenda | — |
| Orders | `GET /orders/mine`, `GET /orders/relevant-for-provider` | `POST /orders` |
| Quotes | — | `POST /quotes`, `PUT /quotes/:id/accept`, `PUT /quotes/:id/reject` |
| Chat | `GET /messages` | `POST /chats`, `POST /messages` |
| Notifications | `GET /notifications` | `PUT /notifications/:id/read` |
| Reviews | `GET /reviews` | `POST /reviews` |
| Payments | `GET /payments` | `POST /payments` |

## 6. Añadir un nuevo escenario

1. Crea `scenarios/<dominio>/<nombre>.scenario.js`, exportando una función reutilizable (mira cualquiera de los existentes como plantilla: usa `helpers/http.js`, `helpers/auth.js`, `helpers/metrics.js`, `helpers/checks.js`, y `data/fixtures.js` para los datos).
2. Regístrala en `tests/_registry.js` (envuélvela con `paced(...)` salvo que deba medir concurrencia sin pausas, como `auth_login`).
3. Añádela a `READ_SCENARIOS`/`WRITE_SCENARIOS` en el/los `tests/*.js` donde deba correr, y a los `thresholds` correspondientes en `config/thresholds.js`.

No dupliques lógica de login/HTTP/checks/métricas — todo eso ya vive en `helpers/`.
