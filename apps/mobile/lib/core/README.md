# Core Module (Flutter)

## Qué representa

`core` es el **shared kernel** del dominio en el cliente móvil: no modela ningún
concepto de negocio propio. Provee las piezas estructurales que todos los demás
módulos (Identity, Profiles, Verification, Trust, Audit, Authentication,
Credentials, Contact, Address, ...) reutilizan para mantenerse consistentes.

Contiene únicamente:

- `Entity<TId>` — clase base para toda entidad de dominio; igualdad estructural
  por tipo + id.
- `ValueObject` — clase base para todo value object; igualdad por el valor de
  sus `props` (inmutables).
- `DomainException` — excepción base de la que heredan las excepciones de
  dominio de los demás módulos (ninguna se define aquí todavía).
- `generateId()` — utilidad pura para generar identificadores únicos (UUID v4),
  sin dependencias de red ni persistencia.

## Por qué existe como módulo aparte

Evita que cada módulo reinvente su propia noción de "entidad" o "value object",
manteniendo reglas de igualdad e identidad uniformes en todo el dominio.

## Qué NO contiene

- Ninguna entidad de negocio.
- Ningún widget, pantalla o navegación.
- Ninguna llamada a red, base de datos local o almacenamiento.

## Estructura

```
core/
  README.md
  base/
    entity.dart
    value_object.dart
  exceptions/
    domain_exception.dart
  utils/
    id_generator.dart
```

## Cómo lo reutilizan los demás módulos

Cada módulo futuro extiende `Entity<TId>` para su entidad principal y
`ValueObject` para sus value objects (ej. `IdentityId`, `AddressType`), y usa
`generateId()` para producir sus identificadores. Ningún módulo de negocio
modifica `core`; solo lo consume.
