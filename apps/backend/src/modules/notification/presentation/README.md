# Notification — Presentation Layer

Estructura REST del módulo `Notification`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta                       | Use Case                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/notifications`            | `CreateNotificationUseCase`      |
| PUT    | `/notifications/:id/read`   | `MarkNotificationAsReadUseCase`  |
| DELETE | `/notifications/:id`        | `DeleteNotificationUseCase`      |
| GET    | `/notifications/:id`        | `GetNotificationUseCase`         |

## Estructura

```
presentation/
  README.md
  notification.module.ts
  controllers/
    notification.controller.ts
  routes/
    notification.routes.ts
  swagger/
    notification.swagger.ts
```

## Qué NO contiene

Lógica de negocio, Firebase Cloud Messaging, Email, SMS, Push, WebSockets,
conexión a base de datos, JWT, autenticación, Guards, Interceptors,
Filters, Middleware ni providers de infraestructura.
