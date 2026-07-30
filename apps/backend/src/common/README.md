# Common (Sprint 3, Etapa 1)

Infraestructura transversal de NestJS — bootstrap, no lógica de
negocio. Nada aquí conoce ningún módulo de dominio salvo la jerarquía
de excepciones de `core/` (`DomainExceptionFilter`).

```
common/
  logger/
    app-logger.service.ts   — envuelve el Logger de Nest, inyectable, reutilizable
    logger.module.ts        — @Global(), expone AppLogger
  observability/
    observability.port.ts             — ObservabilityPort (interfaz) + token OBSERVABILITY_PORT
    logger-observability.adapter.ts    — implementación por defecto, delega en AppLogger
    observability.module.ts           — @Global(), expone OBSERVABILITY_PORT
    (seam para un futuro Sentry/OpenTelemetry sin tocar los call sites;
    ninguna dependencia nueva instalada)
  filters/
    error-response.ts           — forma única de toda respuesta de error
    domain-exception.filter.ts  — DomainException → HTTP (404/400/422)
    all-exceptions.filter.ts    — fallback: HttpException de Nest + errores inesperados → 500
    (los 500 nunca reenvían el mensaje/stack real al cliente — solo
    "Internal server error"; el detalle real se loguea server-side)
  interceptors/
    logging.interceptor.ts  — loguea método/ruta/duración de cada request
  pipes/       (reservado — ver README propio)
  middlewares/ (reservado — ver README propio)
```

Registrado globalmente en `main.ts` (`useGlobalFilters`/
`useGlobalInterceptors`) — ningún controller necesita configurarlo por
su cuenta, incluidos los que Sprint 3 agregue después.
