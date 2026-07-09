# Identity Module (Backend)

## Qué representa

`Identity` modela la **identidad legal/civil de una persona**: quién es, según
un documento oficial. Es el módulo raíz del que dependen todos los módulos de
negocio (Profiles, Verification, Trust, Audit, Authentication, Credentials,
Contact, Address, ...), que referencian su `IdentityId` en lugar de duplicar
información personal.

Campos representados (sin comportamiento, solo datos):

- `IdentityId`
- `fullName`
- `documentType` (tipo de documento)
- `documentNumber`
- `birthDate`
- `status` (estado de la identidad)
- `createdAt`, `updatedAt`

## Diferencia con otros módulos

- **Identity vs Profiles**: Identity es el dato legal/civil (documento, nombre
  legal); Profiles es la representación pública/social (avatar, bio, alias).
- **Identity vs Contact/Address**: Identity no contiene canales de contacto ni
  ubicaciones — esos son módulos aparte que referencian `IdentityId`.
- **Identity vs Authentication/Credentials**: Identity no sabe cómo una persona
  inicia sesión; eso es responsabilidad de otros módulos que también solo
  referencian `IdentityId`.

## Qué NO contiene

- Lógica de negocio, validaciones de formato, casos de uso.
- DTOs, controladores, servicios de aplicación.
- Persistencia concreta (solo se define el contrato `IdentityRepository`).
- Autenticación, JWT, login, registro.

## Estructura

```
identity/
  README.md
  domain/
    value-objects/
      identity-id.value-object.ts
      document-type.value-object.ts
      identity-status.value-object.ts
    entities/
      identity.entity.ts
    interfaces/
      identity-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Cómo lo reutilizan los demás módulos

Todo módulo que necesite asociarse a una persona reutiliza `IdentityId`
importándolo desde aquí — nunca redefine su propio identificador de persona.
`Identity` nunca conoce ni referencia a los módulos que dependen de ella.
