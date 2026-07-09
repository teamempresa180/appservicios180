# Order — Presentation Layer

Estructura REST del módulo `Order`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta                | Use Case             |
|--------|---------------------|-----------------------|
| POST   | `/orders`            | `CreateOrderUseCase`  |
| PUT    | `/orders/:id`        | `UpdateOrderUseCase`  |
| PUT    | `/orders/:id/cancel` | `CancelOrderUseCase`  |
| GET    | `/orders/:id`        | `GetOrderUseCase`     |

## Estructura

```
presentation/
  README.md
  order.module.ts
  controllers/
    order.controller.ts
  routes/
    order.routes.ts
  swagger/
    order.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
