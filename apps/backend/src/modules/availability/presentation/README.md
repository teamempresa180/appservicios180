# Availability — Presentation Layer

Estructura REST del módulo `Availability`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application. Como los
Use Cases aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta                  | Use Case                  |
|--------|-----------------------|-----------------------------|
| POST   | `/availabilities`      | `CreateAvailabilityUseCase` |
| PUT    | `/availabilities/:id`  | `UpdateAvailabilityUseCase` |
| DELETE | `/availabilities/:id`  | `DeleteAvailabilityUseCase` |
| GET    | `/availabilities/:id`  | `GetAvailabilityUseCase`    |

## Estructura

```
presentation/
  README.md
  availability.module.ts
  controllers/
    availability.controller.ts
  routes/
    availability.routes.ts
  swagger/
    availability.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
