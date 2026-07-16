# Trust — Presentation Layer

Estructura REST del módulo `Trust`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta                   | Use Case                    |
|--------|------------------------|--------------------------------|
| POST   | `/trust-profiles`       | `CreateTrustProfileUseCase`   |
| PUT    | `/trust-profiles/:id`   | `UpdateTrustProfileUseCase`   |
| GET    | `/trust-profiles/:id`   | `GetTrustUseCase`             |

## Estructura

```
presentation/
  README.md
  trust.module.ts
  controllers/
    trust.controller.ts
  routes/
    trust.routes.ts
  swagger/
    trust.swagger.ts
```

## Qué NO contiene

Lógica de negocio, cálculo de puntaje, conexión a base de datos, JWT,
autenticación, Guards, Interceptors, Filters, Middleware ni providers de
infraestructura.
