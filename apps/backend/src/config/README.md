# Config (Sprint 3, Etapa 1)

Módulo global de configuración — la única parte de la app que lee
`process.env` directamente.

- `env.validation.ts` — valida `process.env` contra
  `EnvironmentVariables` (hoy: `NODE_ENV`, `PORT`, lo único que el
  bootstrap actual necesita), falla rápido al arrancar si algo falta
  o es inválido.
- `config.service.ts` — acceso tipado (`ConfigService.port`,
  `.nodeEnv`, `.isProduction`).
- `config.module.ts` — `@Global()`, se importa una vez en
  `AppModule`, inyectable en cualquier módulo sin volver a importarlo.

No usa `@nestjs/config` (no estaba instalado) — evaluar agregarlo
queda para cuando el esquema de configuración crezca lo suficiente
para justificar la dependencia (p. ej. cuando existan variables de
base de datos reales).

Ver `.env.example` en la raíz de `apps/backend/` para las variables
disponibles — sin credenciales reales, `.env` sigue ignorado por git.
