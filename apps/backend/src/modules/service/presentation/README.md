# Service — Presentation Layer

Estructura REST del módulo `Service`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta           | Use Case             |
|--------|----------------|-----------------------|
| POST   | `/services`     | `CreateServiceUseCase` |
| PUT    | `/services/:id` | `UpdateServiceUseCase` |
| DELETE | `/services/:id` | `DeleteServiceUseCase` |
| GET    | `/services/:id` | `GetServiceUseCase`    |

## Estructura

```
presentation/
  README.md
  service.module.ts
  controllers/
    service.controller.ts
  routes/
    service.routes.ts
  swagger/
    service.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
