# Review — Presentation Layer

Estructura REST del módulo `Review`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta           | Use Case             |
|--------|----------------|-----------------------|
| POST   | `/reviews`      | `CreateReviewUseCase` |
| PUT    | `/reviews/:id`  | `UpdateReviewUseCase` |
| DELETE | `/reviews/:id`  | `DeleteReviewUseCase` |
| GET    | `/reviews/:id`  | `GetReviewUseCase`    |

## Estructura

```
presentation/
  README.md
  review.module.ts
  controllers/
    review.controller.ts
  routes/
    review.routes.ts
  swagger/
    review.swagger.ts
```

## Qué NO contiene

Lógica de negocio, moderación, cálculo de Trust Score, conexión a base de
datos, JWT, autenticación, Guards, Interceptors, Filters, Middleware ni
providers de infraestructura.
