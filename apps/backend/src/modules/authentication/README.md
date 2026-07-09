# Authentication Module (Backend)

## Qué representa

`Authentication` modela la **asociación entre una `Identity` y un método que
puede usar para autenticarse** (contraseña, biometría, código de un solo uso,
tercero). Representa que el método existe y su estado — no ejecuta ningún
flujo de inicio de sesión.

Campos representados (sin comportamiento, solo datos):

- `AuthenticationId`
- `IdentityId` (reutilizado de `identity`)
- `methodType`
- `status` (activo / inactivo / bloqueado / revocado)
- `createdAt`, `updatedAt`

## Diferencia con Credentials

`Authentication` dice *qué método* existe. `Credentials` (siguiente módulo)
representará el material secreto asociado a ese método (p. ej. el hash de una
contraseña) — nunca el secreto en sí mismo aquí.

## Qué NO contiene

Login, registro, JWT, OAuth, integraciones con proveedores externos, APIs,
DTOs, casos de uso, controladores, persistencia, almacenamiento de secretos.

## Estructura

```
authentication/
  README.md
  domain/
    value-objects/
      authentication-id.value-object.ts
      auth-method-type.value-object.ts
      authentication-status.value-object.ts
    entities/
      authentication.entity.ts
    interfaces/
      authentication-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Authentication` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Authentication`.
