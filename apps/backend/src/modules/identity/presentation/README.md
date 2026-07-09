# Identity — Presentation Layer

Estructura REST del módulo `Identity`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta            | Use Case              |
|--------|-----------------|------------------------|
| POST   | `/identities`     | `CreateIdentityUseCase` |
| PUT    | `/identities/:id` | `UpdateIdentityUseCase` |
| DELETE | `/identities/:id` | `DeleteIdentityUseCase` |
| GET    | `/identities/:id` | `GetIdentityUseCase`    |

## Estructura

```
presentation/
  README.md
  identity.module.ts
  controllers/
    identity.controller.ts
  routes/
    identity.routes.ts
  swagger/
    identity.swagger.ts
```

## Swagger

Cada endpoint documenta únicamente `summary`, `description` y la respuesta
esperada — sin reglas de negocio.

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura. El
repositorio de dominio se referencia como placeholder no implementado hasta
que exista la capa Infrastructure.
