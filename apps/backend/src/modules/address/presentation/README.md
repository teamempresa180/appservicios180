# Address — Presentation Layer

Estructura REST del módulo `Address`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta            | Use Case             |
|--------|-----------------|-----------------------|
| POST   | `/addresses`     | `CreateAddressUseCase` |
| PUT    | `/addresses/:id` | `UpdateAddressUseCase` |
| DELETE | `/addresses/:id` | `DeleteAddressUseCase` |
| GET    | `/addresses/:id` | `GetAddressUseCase`    |

## Estructura

```
presentation/
  README.md
  address.module.ts
  controllers/
    address.controller.ts
  routes/
    address.routes.ts
  swagger/
    address.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
