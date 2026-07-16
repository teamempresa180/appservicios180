# Category — Presentation Layer

Estructura REST del módulo `Category`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta             | Use Case              |
|--------|------------------|-------------------------|
| POST   | `/categories`     | `CreateCategoryUseCase` |
| PUT    | `/categories/:id` | `UpdateCategoryUseCase` |
| DELETE | `/categories/:id` | `DeleteCategoryUseCase` |
| GET    | `/categories/:id` | `GetCategoryUseCase`    |

## Estructura

```
presentation/
  README.md
  category.module.ts
  controllers/
    category.controller.ts
  routes/
    category.routes.ts
  swagger/
    category.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
