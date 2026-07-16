# Attachment — Presentation Layer

Estructura REST del módulo `Attachment`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application, ya implementado con persistencia real (Prisma).

## Endpoints

| Método | Ruta               | Use Case                |
|--------|--------------------|----------------------------|
| POST   | `/attachments`      | `CreateAttachmentUseCase` |
| DELETE | `/attachments/:id`  | `DeleteAttachmentUseCase` |
| GET    | `/attachments/:id`  | `GetAttachmentUseCase`    |

## Estructura

```
presentation/
  README.md
  attachment.module.ts
  controllers/
    attachment.controller.ts
  routes/
    attachment.routes.ts
  swagger/
    attachment.swagger.ts
```

## Qué NO contiene

Lógica de negocio, almacenamiento de archivos, Firebase Storage, S3,
Cloudinary, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
