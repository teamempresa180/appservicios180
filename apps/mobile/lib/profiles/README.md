# Profiles Module (Flutter)

## Qué representa

`profiles` modela la representación pública/social de una persona (nombre
visible, avatar, biografía, visibilidad), en contraste con su identidad legal.

## Diferencia con Identity

`Identity` es el dato legal/civil. `Profile` es la cara pública que una
persona elige mostrar dentro de la app.

## Qué NO contiene

Lógica de negocio, validaciones, persistencia, widgets/pantallas.

## Estructura

```
profiles/
  README.md
  models/
    profile_id.dart
    profile_visibility.dart
    profile_status.dart
  entities/
    profile.dart
```

## Relaciones

`Profile` únicamente referencia `IdentityId`. `Identity` nunca conoce `Profile`.
