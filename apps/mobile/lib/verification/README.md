# Verification Module (Flutter)

## Qué representa

`verification` modela un registro de verificación (documento, rostro,
dirección, teléfono, correo) asociado a una `Identity`.

## Diferencia con Identity

`Identity` es el dato declarado por la persona. `Verification` es evidencia de
que ese dato fue confirmado por un proceso externo.

## Qué NO contiene

Lógica de negocio, integraciones con proveedores de KYC, persistencia,
widgets/pantallas.

## Estructura

```
verification/
  README.md
  models/
    verification_id.dart
    verification_type.dart
    verification_status.dart
  entities/
    verification.dart
```

## Relaciones

`Verification` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Verification`.
