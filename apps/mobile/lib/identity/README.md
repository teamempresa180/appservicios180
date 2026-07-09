# Identity Module (Flutter)

## Qué representa

`identity` modela la **identidad legal/civil de una persona**: quién es, según
un documento oficial. Es el módulo raíz del que dependen todos los módulos de
negocio (Profiles, Verification, Trust, Audit, Authentication, Credentials,
Contact, Address, ...), que referencian su `IdentityId` en lugar de duplicar
información personal.

## Diferencia con otros módulos

- **Identity vs Profiles**: Identity es el dato legal/civil; Profiles es la
  representación pública/social.
- **Identity vs Contact/Address**: Identity no contiene canales de contacto ni
  ubicaciones — son módulos aparte que referencian `IdentityId`.

## Qué NO contiene

Lógica de negocio, validaciones, persistencia, autenticación, widgets/pantallas.

## Estructura

```
identity/
  README.md
  models/
    identity_id.dart
    document_type.dart
    identity_status.dart
  entities/
    identity.dart
```

## Cómo lo reutilizan los demás módulos

Todo módulo que necesite asociarse a una persona reutiliza `IdentityId`
importándolo desde aquí. `Identity` nunca conoce a los módulos que dependen
de ella.
