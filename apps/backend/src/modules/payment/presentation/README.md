# Payment — Presentation Layer

Estructura REST del módulo `Payment`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta                  | Use Case              |
|--------|-----------------------|--------------------------|
| POST   | `/payments`            | `CreatePaymentUseCase`  |
| PUT    | `/payments/:id`        | `UpdatePaymentUseCase`  |
| PUT    | `/payments/:id/cancel` | `CancelPaymentUseCase`  |
| GET    | `/payments/:id`        | `GetPaymentUseCase`     |

## Estructura

```
presentation/
  README.md
  payment.module.ts
  controllers/
    payment.controller.ts
  routes/
    payment.routes.ts
  swagger/
    payment.swagger.ts
```

## Qué NO contiene

Lógica de negocio, integración con pasarelas de pago, conexión a base de
datos, JWT, autenticación, Guards, Interceptors, Filters, Middleware ni
providers de infraestructura.
