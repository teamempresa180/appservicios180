# Trust Module (Backend)

## Qué representa

`Trust` modela el **registro de confianza/reputación** de una persona dentro
de la plataforma: un puntaje y un nivel cualitativo asociados a su `Identity`.
No calcula el puntaje ni define reglas de negocio — solo lo representa.

Campos representados (sin comportamiento, solo datos):

- `TrustId`
- `IdentityId` (reutilizado de `identity`)
- `score` (puntaje numérico envuelto en un value object)
- `level` (bajo / medio / alto / muy alto)
- `status`
- `createdAt`, `updatedAt`

## Diferencia con Verification

`Verification` registra si un dato específico fue confirmado. `Trust` es un
indicador agregado de reputación que, en el futuro, podría alimentarse de
verificaciones, historial de uso, calificaciones, etc. — pero ese cálculo no
vive en este módulo.

## Qué NO contiene

Algoritmos de cálculo de puntaje, reglas de negocio, persistencia, casos de
uso, controladores.

## Estructura

```
trust/
  README.md
  domain/
    value-objects/
      trust-id.value-object.ts
      trust-score.value-object.ts
      trust-level.value-object.ts
      trust-status.value-object.ts
    entities/
      trust.entity.ts
    interfaces/
      trust-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Trust` únicamente referencia `IdentityId`. `Identity` nunca conoce `Trust`.
