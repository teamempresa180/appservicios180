# Audit Module (Flutter)

## Qué representa

`audit` modela una entrada de bitácora inmutable: qué acción realizó una
`Identity` y cuándo. No tiene `status` ni `updatedAt` — es un hecho ocurrido.

## Qué NO contiene

Lógica de negocio, mecanismos de logging técnico, persistencia,
widgets/pantallas.

## Estructura

```
audit/
  README.md
  models/
    audit_id.dart
    audit_action_type.dart
  entities/
    audit.dart
```

## Relaciones

`Audit` únicamente referencia `IdentityId`. `Identity` nunca conoce `Audit`.
