# Contact — Presentation Layer

Estructura REST del módulo `Contact`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta           | Use Case             |
|--------|----------------|-----------------------|
| POST   | `/contacts`     | `CreateContactUseCase` |
| PUT    | `/contacts/:id` | `UpdateContactUseCase` |
| DELETE | `/contacts/:id` | `DeleteContactUseCase` |
| GET    | `/contacts/:id` | `GetContactUseCase`    |

## Estructura

```
presentation/
  README.md
  contact.module.ts
  controllers/
    contact.controller.ts
  routes/
    contact.routes.ts
  swagger/
    contact.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
