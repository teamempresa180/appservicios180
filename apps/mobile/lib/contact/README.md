# Contact Module (Flutter)

## Qué representa

`contact` modela un canal de contacto (correo, teléfono) asociado a una
`Identity`. Solo representa el dato — no valida formato ni verifica
alcanzabilidad.

## Diferencia con Address

`Contact` representa canales de comunicación. `Address` representa
ubicaciones físicas. Ambos son independientes y solo referencian `IdentityId`.

## Por qué una persona puede tener múltiples contactos

Una `Identity` puede tener varios correos y teléfonos, cada uno como un
`Contact` independiente.

## Qué NO contiene

Validación de formato, verificación de alcanzabilidad, envío de mensajes,
persistencia, widgets/pantallas.

## Estructura

```
contact/
  README.md
  models/
    contact_id.dart
    contact_type.dart
    contact_status.dart
  entities/
    contact.dart
```

## Relaciones

`Contact` únicamente referencia `IdentityId`. `Identity` nunca conoce
`Contact`.
