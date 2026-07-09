# Authentication Module (Flutter)

## Qué representa

`authentication` modela la asociación entre una `Identity` y un método que
puede usar para autenticarse (contraseña, biometría, código de un solo uso,
tercero). No ejecuta ningún flujo de inicio de sesión.

## Diferencia con Credentials

`Authentication` dice qué método existe. `Credentials` representará el
material secreto asociado — nunca el secreto en sí mismo aquí.

## Qué NO contiene

Login, registro, JWT, OAuth, integraciones externas, persistencia,
widgets/pantallas.

## Estructura

```
authentication/
  README.md
  models/
    authentication_id.dart
    auth_method_type.dart
    authentication_status.dart
  entities/
    authentication.dart
```

## Relaciones

`Authentication` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Authentication`.
