# Schedule — Presentation Layer

Estructura REST del módulo `Schedule`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta             | Use Case              |
|--------|------------------|-------------------------|
| POST   | `/schedules`      | `CreateScheduleUseCase` |
| PUT    | `/schedules/:id`  | `UpdateScheduleUseCase` |
| DELETE | `/schedules/:id`  | `DeleteScheduleUseCase` |
| GET    | `/schedules/:id`  | `GetScheduleUseCase`    |

## Estructura

```
presentation/
  README.md
  schedule.module.ts
  controllers/
    schedule.controller.ts
  routes/
    schedule.routes.ts
  swagger/
    schedule.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
