# Authentication — Presentation Layer

Estructura REST del módulo `Authentication`. Sin lógica de negocio: cada
endpoint solo invoca el Use Case correspondiente de Application. Como los
Use Cases aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta                    | Use Case                     |
|--------|-------------------------|-------------------------------|
| POST   | `/authentications`       | `CreateAuthenticationUseCase` |
| PUT    | `/authentications/:id`   | `UpdateAuthenticationUseCase` |
| DELETE | `/authentications/:id`   | `DeleteAuthenticationUseCase` |
| GET    | `/authentications/:id`   | `GetAuthenticationUseCase`    |

## Estructura

```
presentation/
  README.md
  authentication.module.ts
  controllers/
    authentication.controller.ts
  routes/
    authentication.routes.ts
  swagger/
    authentication.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación real,
Guards, Interceptors, Filters, Middleware ni providers de infraestructura.
