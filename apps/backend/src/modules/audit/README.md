# Audit Module (Backend)

## Qué representa

`Audit` modela una **entrada de bitácora inmutable**: qué acción realizó una
`Identity` y cuándo. Es un registro de trazabilidad, no un log técnico de
sistema ni un mecanismo de auditoría de infraestructura.

Campos representados (sin comportamiento, solo datos):

- `AuditId`
- `IdentityId` (reutilizado de `identity`, quién realizó la acción)
- `actionType` (creó / actualizó / eliminó / accedió / inició sesión / ...)
- `description`
- `occurredAt`

A diferencia de otros módulos, `Audit` no tiene `status` ni `updatedAt`: una
entrada de auditoría es un hecho ocurrido, no un registro que cambie de estado.

## Diferencia con Verification y Trust

`Verification` confirma un dato puntual; `Trust` resume una reputación.
`Audit` simplemente deja constancia de una acción concreta en el tiempo.

## Qué NO contiene

Lógica de negocio, mecanismos de logging técnico, persistencia, casos de uso,
controladores.

## Estructura

```
audit/
  README.md
  domain/
    value-objects/
      audit-id.value-object.ts
      audit-action-type.value-object.ts
    entities/
      audit.entity.ts
    interfaces/
      audit-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Audit` únicamente referencia `IdentityId`. `Identity` nunca conoce `Audit`.
