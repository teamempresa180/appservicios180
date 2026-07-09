# Credentials Module (Backend)

## Qué representa

`Credentials` deja constancia de que **existe un material de credencial** de
un tipo dado para una `Identity` (contraseña, código de recuperación, llave de
seguridad). Nunca almacena el secreto, hash o llave en sí.

Campos representados (sin comportamiento, solo datos):

- `CredentialId`
- `IdentityId` (reutilizado de `identity`)
- `type`
- `status` (activo / expirado / revocado)
- `createdAt`, `updatedAt`

## Diferencia con Authentication

`Authentication` representa el método de acceso disponible. `Credentials`
representa que el material secreto de ese método existe — sin guardar el
secreto, sin hashing, sin verificación.

## Qué NO contiene

Hashing, cifrado, almacenamiento de secretos reales, login, JWT, persistencia,
casos de uso, controladores.

## Estructura

```
credentials/
  README.md
  domain/
    value-objects/
      credential-id.value-object.ts
      credential-type.value-object.ts
      credential-status.value-object.ts
    entities/
      credential.entity.ts
    interfaces/
      credential-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Credential` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Credential`.
