# Profiles — Presentation Layer

Estructura REST del módulo `Profiles`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta           | Use Case             |
|--------|----------------|-----------------------|
| POST   | `/profiles`     | `CreateProfileUseCase` |
| PUT    | `/profiles/:id` | `UpdateProfileUseCase` |
| DELETE | `/profiles/:id` | `DeleteProfileUseCase` |
| GET    | `/profiles/:id` | `GetProfileUseCase`    |

## Estructura

```
presentation/
  README.md
  profile.module.ts
  controllers/
    profile.controller.ts
  routes/
    profile.routes.ts
  swagger/
    profile.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
