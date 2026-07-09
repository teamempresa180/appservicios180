# Audit — Presentation Layer

Estructura REST del módulo `Audit`. Sin lógica de negocio: cada endpoint
solo invoca el Use Case correspondiente de Application. Como los Use Cases
aún no están implementados, toda petición responde con el error
`"Not implemented yet"`.

## Endpoints

| Método | Ruta                  | Use Case                  |
|--------|-----------------------|------------------------------|
| POST   | `/audit-records`       | `CreateAuditRecordUseCase`  |
| GET    | `/audit-records/:id`   | `GetAuditUseCase`           |

No existen endpoints `PUT`/`DELETE`: los registros de auditoría son
inmutables por diseño.

## Estructura

```
presentation/
  README.md
  audit.module.ts
  controllers/
    audit.controller.ts
  routes/
    audit.routes.ts
  swagger/
    audit.swagger.ts
```

## Qué NO contiene

Lógica de negocio, conexión a base de datos, JWT, autenticación, Guards,
Interceptors, Filters, Middleware ni providers de infraestructura.
