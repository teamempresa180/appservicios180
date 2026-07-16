# Quote — Presentation Layer

Estructura REST del módulo `Quote`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta                 | Use Case             |
|--------|----------------------|-----------------------|
| POST   | `/quotes`             | `CreateQuoteUseCase`  |
| PUT    | `/quotes/:id`         | `UpdateQuoteUseCase`  |
| PUT    | `/quotes/:id/accept`  | `AcceptQuoteUseCase`  |
| PUT    | `/quotes/:id/reject`  | `RejectQuoteUseCase`  |
| GET    | `/quotes/:id`         | `GetQuoteUseCase`     |

## Estructura

```
presentation/
  README.md
  quote.module.ts
  controllers/
    quote.controller.ts
  routes/
    quote.routes.ts
  swagger/
    quote.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
