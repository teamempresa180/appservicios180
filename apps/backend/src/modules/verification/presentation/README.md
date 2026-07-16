# Verification — Presentation Layer

Estructura REST del módulo `Verification`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta                  | Use Case                   |
|--------|-----------------------|-------------------------------|
| POST   | `/verifications`       | `CreateVerificationUseCase`  |
| PUT    | `/verifications/:id`   | `UpdateVerificationUseCase`  |
| GET    | `/verifications/:id`   | `GetVerificationUseCase`     |

## Estructura

```
presentation/
  README.md
  verification.module.ts
  controllers/
    verification.controller.ts
  routes/
    verification.routes.ts
  swagger/
    verification.swagger.ts
```

## Qué NO contiene

Lógica de negocio, OCR, reconocimiento facial, conexión a base de datos,
JWT, autenticación, Guards, Interceptors, Filters, Middleware ni providers
de infraestructura.
