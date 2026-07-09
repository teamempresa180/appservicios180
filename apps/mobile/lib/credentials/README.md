# Credentials Module (Flutter)

## Qué representa

`credentials` deja constancia de que existe un material de credencial de un
tipo dado para una `Identity`. Nunca almacena el secreto, hash o llave en sí.

## Diferencia con Authentication

`Authentication` representa el método de acceso disponible. `Credentials`
representa que el material secreto de ese método existe.

## Qué NO contiene

Hashing, cifrado, almacenamiento de secretos reales, persistencia,
widgets/pantallas.

## Estructura

```
credentials/
  README.md
  models/
    credential_id.dart
    credential_type.dart
    credential_status.dart
  entities/
    credential.dart
```

## Relaciones

`Credential` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Credential`.
