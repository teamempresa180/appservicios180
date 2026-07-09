# Trust Module (Flutter)

## Qué representa

`trust` modela el registro de confianza/reputación de una persona: un puntaje
y un nivel cualitativo asociados a su `Identity`. No calcula el puntaje.

## Diferencia con Verification

`Verification` registra si un dato específico fue confirmado. `Trust` es un
indicador agregado de reputación.

## Qué NO contiene

Algoritmos de cálculo, reglas de negocio, persistencia, widgets/pantallas.

## Estructura

```
trust/
  README.md
  models/
    trust_id.dart
    trust_score.dart
    trust_level.dart
    trust_status.dart
  entities/
    trust.dart
```

## Relaciones

`Trust` únicamente referencia `IdentityId`. `Identity` nunca conoce `Trust`.
