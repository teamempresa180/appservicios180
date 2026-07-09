# Chat — Presentation Layer

Estructura REST del módulo `Chat`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta              | Use Case          |
|--------|-------------------|---------------------|
| POST   | `/chats`           | `CreateChatUseCase` |
| PUT    | `/chats/:id/close` | `CloseChatUseCase`  |
| GET    | `/chats/:id`       | `GetChatUseCase`    |

## Estructura

```
presentation/
  README.md
  chat.module.ts
  controllers/
    chat.controller.ts
  routes/
    chat.routes.ts
  swagger/
    chat.swagger.ts
```

## Qué NO contiene

Lógica de negocio, mensajes, WebSockets, tiempo real, conexión a base de
datos, JWT, autenticación, Guards, Interceptors, Filters, Middleware ni
providers de infraestructura.
