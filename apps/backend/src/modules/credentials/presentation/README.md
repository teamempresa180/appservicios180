# Credentials — Presentation Layer

Estructura REST del módulo `Credentials`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta               | Use Case                 |
|--------|--------------------|----------------------------|
| POST   | `/credentials`      | `CreateCredentialUseCase` |
| PUT    | `/credentials/:id`  | `UpdateCredentialUseCase` |
| DELETE | `/credentials/:id`  | `DeleteCredentialUseCase` |
| GET    | `/credentials/:id`  | `GetCredentialUseCase`    |

## Estructura

```
presentation/
  README.md
  credential.module.ts
  controllers/
    credential.controller.ts
  routes/
    credential.routes.ts
  swagger/
    credential.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
