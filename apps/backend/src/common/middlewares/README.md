# Middlewares (reservado)

Carpeta reservada para middlewares transversales (Fase 7, Prompt 58 —
Sprint 3 Etapa 1).

**Vacía a propósito.** El único candidato considerado en esta etapa
—logging por request— ya está cubierto por `LoggingInterceptor`
(`common/interceptors/logging.interceptor.ts`), que además tiene
acceso al tiempo de respuesta (algo que un middleware, al ejecutarse
antes del handler, no puede medir por sí solo). No se identificó
ningún otro caso de uso real todavía: no hay autenticación (sería el
candidato típico para un middleware de sesión/token), no hay
CORS/rate-limiting configurado explícitamente por el usuario.

Se crea cuando exista un caso de uso real (p. ej. el middleware de
sesión, en la etapa de Identity & Access del roadmap de
`SPRINT3_PREPARATION.md`) — no antes.
