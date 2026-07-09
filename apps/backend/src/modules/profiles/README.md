# Profiles Module (Backend)

## Qué representa

`Profiles` modela la **representación pública/social** de una persona: cómo se
muestra dentro de la aplicación (nombre visible, avatar, biografía, visibilidad),
en contraste con su identidad legal.

Campos representados (sin comportamiento, solo datos):

- `ProfileId`
- `IdentityId` (reutilizado de `identity`)
- `displayName`
- `avatarUrl`
- `bio`
- `visibility` (público / privado / solo contactos)
- `status`
- `createdAt`, `updatedAt`

## Diferencia con Identity

`Identity` es el dato legal/civil (documento, nombre legal, fecha de
nacimiento). `Profile` es la cara pública que una persona elige mostrar, y
puede diferir del nombre legal (ej. apodo). Una `Identity` puede tener uno o
más `Profile` a futuro (por ejemplo, perfiles distintos por rol dentro de la
plataforma).

## Qué NO contiene

Lógica de negocio, validaciones, persistencia, autenticación, casos de uso,
controladores.

## Estructura

```
profiles/
  README.md
  domain/
    value-objects/
      profile-id.value-object.ts
      profile-visibility.value-object.ts
      profile-status.value-object.ts
    entities/
      profile.entity.ts
    interfaces/
      profile-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Profile` únicamente referencia `IdentityId`. `Identity` nunca conoce `Profile`.
