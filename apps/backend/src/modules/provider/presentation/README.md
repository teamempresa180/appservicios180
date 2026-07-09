# Provider — Presentation Layer

Estructura REST del módulo `Provider`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta            | Use Case              |
|--------|-----------------|-------------------------|
| POST   | `/providers`     | `CreateProviderUseCase` |
| PUT    | `/providers/:id` | `UpdateProviderUseCase` |
| DELETE | `/providers/:id` | `DeleteProviderUseCase` |
| GET    | `/providers/:id` | `GetProviderUseCase`    |

## Estructura

```
presentation/
  README.md
  provider.module.ts
  controllers/
    provider.controller.ts
  routes/
    provider.routes.ts
  swagger/
    provider.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
