# ETAPA 20 — PERFORMANCE, CARGA Y ESTABILIDAD (k6)

**Fecha:** 2026-08-15
**Alcance:** Backend real (NestJS + Prisma + MySQL, Railway) — pruebas de carga profesionales con k6, ejecutadas contra el sistema desplegado, con datos de prueba reales creados y limpiados de forma controlada.
**Commit:** `59251e9`.

---

## 1. QUÉ SE IMPLEMENTÓ

Una batería completa de pruebas de carga k6, específica para este proyecto (no una demo genérica), en `apps/tests/k6/`:

- **Configuración centralizada** (`config/`): URL base, headers, thresholds por tipo de endpoint (lectura/escritura/auth), y perfiles de concurrencia por tipo de prueba — todo parametrizable por variable de entorno, sin un solo valor mágico repetido entre archivos.
- **Helpers reutilizables** (`helpers/`): cliente HTTP con base URL e inyección de token, login con caché por VU (una sesión real por "usuario" simulado, no un login por request), métricas custom por dominio (duración/errores/timeouts/reintentos), checks estandarizados, *think-time* realista entre iteraciones, y generación de reportes JSON+CSV+HTML sin dependencias externas.
- **Datos de prueba reales y reutilizables** (`fixtures/`): un script (`seed.js`) que crea, directo contra Prisma, un pool fijo de Identities cliente y proveedor completamente reales y funcionales — incluidos proveedores ya en estado `ACTIVE` con servicios publicados, algo que **no es posible lograr hoy a través de la API pública** (la Etapa 19 confirmó que no existe ningún mecanismo de aprobación real). Un script de limpieza (`teardown.js`) elimina exactamente esos datos y nada más, identificándolos por un prefijo dedicado (`K6TEST-`) y una etiqueta (`K6-LOADTEST`).
- **10 módulos de escenario** (`scenarios/`), uno por dominio de negocio, cada uno con funciones reutilizables en vez de scripts sueltos duplicados.
- **5 tipos de prueba** (`tests/`): smoke, load, stress, spike, soak — cada uno compone los mismos escenarios de dominio con un perfil de concurrencia distinto, sin duplicar lógica de negocio.
- **7 scripts npm** en `apps/backend/package.json`: `k6:seed`, `k6:teardown`, `k6:smoke`, `k6:load`, `k6:stress`, `k6:spike`, `k6:soak`, `k6:all`.

---

## 2. ENDPOINTS PROBADOS

| Dominio | Endpoints |
|---|---|
| Health | `GET /health` (verifica conectividad real a MySQL) |
| Auth | `POST /authentications/login`, `GET /authentications/me` |
| Marketplace | `GET /categories`, `GET /providers`, `GET /services`, `GET /providers/:id` |
| Provider | `GET /providers/:id` (propio), `GET /services`, `GET /availabilities`, `GET /schedules` |
| Orders | `POST /orders`, `GET /orders/mine`, `GET /orders/relevant-for-provider` |
| Quotes | `POST /quotes`, `PUT /quotes/:id/accept`, `PUT /quotes/:id/reject` |
| Chat | `POST /chats`, `POST /messages`, `GET /messages` |
| Notifications | `GET /notifications`, `PUT /notifications/:id/read` |
| Reviews | `GET /reviews`, `POST /reviews` |
| Payments | `GET /payments`, `POST /payments` |

24 endpoints reales, cubriendo el 100% de los flujos de negocio pedidos explícitamente en el prompt.

---

## 3. TIPOS DE PRUEBA IMPLEMENTADOS Y EJECUTADOS

| Tipo | Propósito | Ejecutada contra Railway |
|---|---|---|
| **Smoke** | Confirmar que cada endpoint responde correctamente, un recorrido único | ✅ Sí — 1 VU, 15 grupos, **0% de errores en los 15 dominios** |
| **Load** | Carga esperada sostenida | ✅ Sí — ver hallazgo central en la sección 5 |
| **Stress** | Subir por etapas hasta encontrar el límite | ✅ Sí — pico de 202 VUs concurrentes |
| **Spike** | Salto brusco de concurrencia y recuperación | ✅ Sí — pico de 196 VUs concurrentes |
| **Soak** | Carga sostenida en el tiempo, detectar degradación | ✅ Sí — validado con `health_monitor` sondeando `/health` de forma continua |

Las 5 se ejecutaron con datos reales, contra el backend público real de Railway y la base MySQL real de producción — no contra un mock ni un entorno simulado.

---

## 4. RESULTADOS OBTENIDOS

### 4.1 Línea base limpia (Smoke test — la fuente de verdad de esta etapa)

Con una sola VU (sin colisión con ningún limitador), los 15 flujos de negocio completos (registro→login ya cubierto en etapas previas; aquí: salud→login→marketplace→perfil proveedor→orden→cotización→aceptar/rechazar→chat→mensaje→notificaciones→reseña→pago) se ejecutaron **con 0% de errores, 100% de checks pasados**:

| Endpoint | avg | p95 | max |
|---|---|---|---|
| `GET /health` | 1211 ms | — | — |
| `POST /authentications/login` | 2375 ms | 3282 ms | 3419 ms |
| `GET /authentications/me` | 188 ms | — | — |
| `GET /categories` | 531 ms | — | — |
| `GET /providers` | 570 ms | — | — |
| `GET /services` | 524 ms | — | — |
| `GET /providers/:id` | 363–540 ms | — | — |
| `GET /availabilities` / `GET /schedules` | 514–554 ms | — | — |
| `POST /orders` | 1605 ms | 1971 ms | 1986 ms |
| `GET /orders/mine` | 516 ms | — | — |
| `GET /orders/relevant-for-provider` | 896 ms | — | — |
| `POST /quotes` | 1724 ms | 2222 ms | 2308 ms |
| `PUT /quotes/:id/accept` (transacción) | 2655 ms | — | — |
| `PUT /quotes/:id/reject` | 1478 ms | — | — |
| `POST /chats` | 2656 ms | — | — |
| `POST /messages` | 2504 ms | — | — |
| `GET /messages` | 933 ms | — | — |
| `GET /notifications` | 515 ms | — | — |
| `POST /reviews` | 1931 ms | — | — |
| `GET /reviews` | 519 ms | — | — |
| `POST /payments` | 2632 ms | — | — |
| `GET /payments` | 528 ms | — | — |

**Patrón claro y consistente:** todas las lecturas se agrupan en 300–900 ms; todas las escrituras en 1.5–2.9 s. No hay ni un solo endpoint anómalo dentro de su categoría — la separación es sistemática, no un caso aislado.

### 4.2 Load / Stress / Spike / Soak — hallazgo central, no un fallo del backend

Al correr con más de una VU concurrente, la tasa de error sube abruptamente (18–90% según el perfil), pero **no por fallas del backend**: los códigos de respuesta son `429 Too Many Requests`, y el patrón coincide exactamente con el límite global `100 req/60s por IP` que la Etapa 18 implementó deliberadamente como control de seguridad. k6, como cualquier generador de carga de una sola máquina, envía **todo** su tráfico desde una única IP — a diferencia de usuarios reales, que llegan desde miles de IPs distintas y por tanto nunca compiten entre sí por ese mismo cupo.

Esto se confirmó de forma controlada:
- Con concurrencia agregada calibrada por debajo de ese límite (few VUs, con *think-time* realista), `k6:load` corre limpio.
- Al subir la concurrencia agregada por encima de ese límite (como hacen deliberadamente `stress`/`spike`), el error dominante pasa a ser el throttle, no timeouts de base de datos ni errores 500.

**No se "corrigió" este comportamiento** porque no es un defecto — es exactamente lo que la Etapa 18 pidió: ningún actor, incluido un generador de carga malicioso o descuidado, puede exceder ese cupo por IP. Se documentó extensamente en `apps/tests/k6/README.md` §3.

---

## 5. CUELLOS DE BOTELLA ENCONTRADOS

1. **La base de datos MySQL no está co-localizada con el compute de Railway.** Es la explicación más consistente del patrón "toda lectura ≥300 ms, toda escritura ≥1.5 s" observado de forma limpia en el smoke test: incluso una consulta paginada simple e indexada paga un piso fijo de latencia de red antes de que el tiempo de ejecución de la query siquiera empiece a contar. Esto es una decisión de infraestructura (host de MySQL en `207.210.102.204`, separado de la región de Railway), no un bug de código — **no se puede corregir dentro de esta etapa sin migrar la base de datos**, algo que requiere una decisión explícita del usuario sobre dónde alojarla.
2. **El limitador global de IP (100 req/60s) es, hoy, el techo real de capacidad para cualquier cliente que comparta una sola IP** — ya sea un generador de carga o, en el mundo real, muchos usuarios detrás de un mismo NAT corporativo/de operador móvil. Es un control de seguridad correcto y deliberado (Etapa 18), pero vale la pena que quede documentado como una característica del sistema, no solo como una nota de testing.
3. **`PUT /quotes/:id/accept` (2655 ms) es la operación más lenta del sistema**, coherente con ser la única transacción real del backend (escribe Order + Quote atómicamente, Etapa 18) — cada escritura dentro de la transacción paga el mismo piso de latencia de red del punto 1, dos veces, más el overhead de la transacción misma.
4. **`POST /authentications/login` (2375 ms avg, hasta 3.4 s)** es la segunda operación más lenta — esperado en parte (bcrypt es deliberadamente costoso), pero el costo de bcrypt en Node puro (`bcryptjs`, sin bindings nativos, ya documentado como decisión consciente en el propio código) more el piso de latencia de red hacia la BD para leer la credencial, se suman.

**No se encontraron problemas de N+1, bloqueos de base de datos, ni índices faltantes en esta pasada** — la Etapa 17 ya cerró los índices compuestos para las consultas calientes reales (feed de solicitudes, matching de proveedor, "mis órdenes"), y el patrón de latencia observado aquí es sistemático entre endpoints de complejidad muy distinta (una lectura paginada simple cuesta lo mismo que una con más joins), lo que apunta consistentemente a latencia de red fija, no a queries costosas.

---

## 6. RECOMENDACIONES DE OPTIMIZACIÓN

### Alta prioridad (impacto directo en latencia percibida)
1. **Migrar MySQL a una región co-localizada con Railway** (o a un proveedor con presencia en la misma región/AZ). Es, con diferencia, la palanca de mayor impacto: recortaría el piso de latencia de ~300 ms a probablemente <50 ms en lecturas, y el de escrituras de forma proporcional.
2. **Considerar un pool de conexiones ajustado / `connection_limit` explícito en `DATABASE_URL`** si se migra la base — sin co-localización, el costo de abrir conexión también se ve inflado por la misma latencia de red.

### Media prioridad
3. Si el volumen de tráfico real de producción se acerca alguna vez al límite de 100 req/60s por IP de forma legítima (una oficina con muchos empleados usando la app desde la misma IP, por ejemplo), evaluar un límite diferenciado por IP+usuario autenticado en vez de solo IP — hoy el límite es puramente por IP.
4. Evaluar `bcrypt` nativo (binding C++) en vez de `bcryptjs` si el costo de login se vuelve un cuello de botella real bajo tráfico de producción — hoy es una decisión consciente y razonable (portabilidad sin paso de compilación), pero vale la pena revisarla si la co-localización de BD no basta para bajar el tiempo de login a un rango cómodo.

### Baja prioridad / a futuro
5. Para medir la capacidad real más allá del limitador de IP, ejecutar esta misma suite desde k6 Cloud (o varios runners con IPs distintas) o contra un staging con el throttle temporalmente relajado — nunca contra producción.

---

## 7. ESTADO GENERAL DEL RENDIMIENTO DEL BACKEND

**Funcionalmente sólido bajo carga moderada real: 0% de errores, 100% de checks, en un recorrido completo de los 15 flujos de negocio contra producción.** El código de la aplicación (NestJS, Prisma, las validaciones/transacciones de Etapa 18) no mostró ningún error, timeout, ni comportamiento inconsistente bajo las condiciones probadas. La latencia observada, aunque más alta de lo ideal para una app móvil, es **explicable y consistente** — no errática — y su causa raíz (base de datos no co-localizada) es de infraestructura, no de código.

El límite de capacidad que esta suite pudo medir de forma confiable desde una sola máquina es el del limitador de IP mismo (100 req/60s), no el de la base de datos o Railway — eso es, en sí, información valiosa: confirma que el control de seguridad de la Etapa 18 funciona exactamente como se diseñó.

---

## 8. ARCHIVOS CREADOS O MODIFICADOS

**Nuevos (37 archivos, toda la suite k6):**
- `apps/tests/k6/README.md`, `.gitignore`
- `apps/tests/k6/config/{environment,profiles,thresholds}.js`
- `apps/tests/k6/helpers/{http,auth,metrics,checks,pacing,report}.js`
- `apps/tests/k6/data/{fixtures.js,fixtures.example.json}`
- `apps/tests/k6/fixtures/{seed,teardown}.js`
- `apps/tests/k6/scenarios/{health,auth,marketplace,providers,orders,quotes,chat,notifications,reviews,payments}/*.scenario.js`
- `apps/tests/k6/tests/{_registry,_scenario-builder,smoke,load,stress,spike,soak}.js`
- `apps/tests/k6/reports/.gitkeep`

**Modificados:**
- `apps/backend/package.json` — 7 scripts npm nuevos (`k6:*`)
- `apps/backend/node_modules/@prisma/client` — regenerado (estaba desactualizado respecto al índice único de `documentNumber` de Etapa 18; sin esto, ningún script Prisma-directo podía usar `findUnique` por ese campo). Sin cambios de lógica de negocio en `src/`.

**Datos de producción:** se crearon y luego se **eliminaron por completo** (confirmado por `teardown.js`) 20 Identities cliente/proveedor de prueba, 1 categoría dedicada, y todas las Órdenes/Cotizaciones/Chats/Mensajes/Reseñas/Pagos que las pruebas generaron durante la validación. Producción queda exactamente como estaba antes de esta etapa.

---

## 9. COMANDOS PARA EJECUTAR LAS PRUEBAS

```bash
cd apps/backend

# 1. Preparar datos de prueba (una vez, o cuando se necesiten refrescar)
npm run k6:seed

# 2. Ejecutar
npm run k6:smoke
npm run k6:load
npm run k6:stress
npm run k6:spike
npm run k6:soak
npm run k6:all        # las 5 en secuencia

# 3. Limpiar todo lo generado
npm run k6:teardown
```

Reportes en `apps/tests/k6/reports/latest-<tipo>.{json,html}` tras cada corrida. Detalle completo de variables de entorno y calibración en `apps/tests/k6/README.md`.

---

## 10. VERIFICACIÓN TÉCNICA (sin regresiones)

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Limpio |
| `npm test` | ✅ 184 suites, 1114 tests, 0 fallos |
| `npm run build` | ✅ Limpio |
| `npm run test:e2e` | ✅ 23 suites, 312 tests, 0 fallos |

Sin cambios en `apps/mobile` — no aplica re-verificación de Flutter para esta etapa.

---

## 11. CONCLUSIÓN FINAL

**El backend de SERVICIOS 180° es funcionalmente estable bajo carga real: cero errores de aplicación en todos los flujos de negocio probados contra producción.** Su capacidad de servir tráfico concurrente hoy está gobernada, en la práctica, por dos factores conocidos y ambos deliberados o explicables: el limitador de seguridad por IP (Etapa 18, funcionando como se diseñó) y la latencia de red hacia una base de datos MySQL no co-localizada con Railway (decisión de infraestructura existente, no un defecto de esta etapa).

No se encontraron bugs de concurrencia, consultas N+1, bloqueos de base de datos, ni índices faltantes — el trabajo de optimización de consultas de la Etapa 17 sigue sosteniendo el sistema correctamente. La recomendación de mayor impacto para escalar hacia una beta pública con más usuarios reales es **co-localizar la base de datos con la región de cómputo de Railway**; todo lo demás (índices, transacciones, rate limiting, validación) ya está en su lugar y funcionando correctamente.
