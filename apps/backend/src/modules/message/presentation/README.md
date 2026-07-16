# Message — Presentation Layer

Estructura REST del módulo `Message`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta            | Use Case            |
|--------|-----------------|------------------------|
| POST   | `/messages`      | `SendMessageUseCase`  |
| DELETE | `/messages/:id`  | `DeleteMessageUseCase`|
| GET    | `/messages/:id`  | `GetMessageUseCase`   |

## Estructura

```
presentation/
  README.md
  message.module.ts
  controllers/
    message.controller.ts
  routes/
    message.routes.ts
  swagger/
    message.swagger.ts
```

## Qué NO contiene

Lógica de negocio, transporte en tiempo real, WebSockets, archivos,
conexión a base de datos, JWT, autenticación, Guards, Interceptors,
Filters, Middleware ni providers de infraestructura.
