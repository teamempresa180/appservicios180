# Verification Module (Backend)

## Qué representa

`Verification` modela un **registro de verificación** (documento, rostro,
dirección, teléfono, correo) asociado a una `Identity`. Representa el hecho de
que algún aspecto de la identidad fue sometido a un proceso de verificación y
su resultado — no el proceso en sí.

Campos representados (sin comportamiento, solo datos):

- `VerificationId`
- `IdentityId` (reutilizado de `identity`)
- `type` (qué se verifica)
- `status` (pendiente / aprobado / rechazado / expirado)
- `verifiedAt`
- `createdAt`, `updatedAt`

## Diferencia con Identity

`Identity` es el dato declarado por la persona. `Verification` es evidencia de
que (parte de) ese dato fue confirmado por un proceso externo. Una `Identity`
puede tener múltiples registros de `Verification` (uno por tipo).

## Qué NO contiene

Lógica de negocio, algoritmos de verificación, integraciones con proveedores
de KYC, persistencia, casos de uso, controladores.

## Estructura

```
verification/
  README.md
  domain/
    value-objects/
      verification-id.value-object.ts
      verification-type.value-object.ts
      verification-status.value-object.ts
    entities/
      verification.entity.ts
    interfaces/
      verification-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Verification` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Verification`.
