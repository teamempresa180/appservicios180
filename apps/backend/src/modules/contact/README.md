# Contact Module (Backend)

## Qué representa

`Contact` modela un **canal de contacto** (correo, teléfono) asociado a una
`Identity`. Solo representa el dato — no valida formato ni verifica que el
canal sea alcanzable (eso es responsabilidad de `Verification`).

Campos representados (sin comportamiento, solo datos):

- `ContactId`
- `IdentityId` (reutilizado de `identity`)
- `type` (correo / teléfono / otro)
- `value` (el dato de contacto en texto)
- `status`
- `createdAt`, `updatedAt`

## Diferencia con Address

`Contact` representa canales de comunicación (correo, teléfono). `Address`
(siguiente módulo) representa ubicaciones físicas. Ambos son independientes y
solo referencian `IdentityId`.

## Por qué una persona puede tener múltiples contactos

Una `Identity` puede tener varios correos y teléfonos (personal, laboral,
etc.), cada uno como un `Contact` independiente.

## Qué NO contiene

Validación de formato de correo/teléfono, verificación de alcanzabilidad,
envío de mensajes, persistencia, casos de uso, controladores.

## Estructura

```
contact/
  README.md
  domain/
    value-objects/
      contact-id.value-object.ts
      contact-type.value-object.ts
      contact-status.value-object.ts
    entities/
      contact.entity.ts
    interfaces/
      contact-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Contact` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Contact`.
