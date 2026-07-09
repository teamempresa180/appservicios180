# Core Module (Backend)

## Qué representa

`Core` es el **shared kernel** del dominio: no modela ningún concepto de negocio propio.
Provee las piezas estructurales que todos los demás módulos (Identity, Profiles,
Verification, Trust, Audit, Authentication, Credentials, Contact, Address, ...)
reutilizan para mantenerse consistentes entre sí.

Contiene únicamente:

- `Entity<TId>` — clase base para toda entidad de dominio, define identidad y su
  igualdad estructural (dos entidades son iguales si son del mismo tipo y comparten id).
- `ValueObject<TProps>` — clase base para todo value object, define igualdad por
  valor de sus propiedades (inmutables).
- `DomainException` — excepción base de la que heredan las excepciones de dominio
  de los demás módulos (ninguna se define aquí todavía).
- `generateId()` — utilidad pura para generar identificadores únicos (UUID v4),
  sin dependencias externas, sin persistencia ni I/O.

## Por qué existe como módulo aparte

Sin un Core compartido, cada módulo terminaría reinventando su propia noción de
"entidad" o "value object", con pequeñas inconsistencias que dificultan mantener
la arquitectura DDD de forma uniforme. Centralizar esto aquí permite que todos los
módulos se construyan sobre las mismas reglas de igualdad e identidad.

## Qué NO contiene

- Ninguna entidad de negocio (eso vive en Identity, Address, etc.).
- Ninguna lógica de aplicación, persistencia, DTOs, controladores o casos de uso.
- Ninguna dependencia de frameworks de infraestructura (bases de datos, HTTP, etc.).

## Estructura

```
core/
  README.md
  domain/
    base/
      entity.base.ts
      value-object.base.ts
    exceptions/
      domain.exception.ts
    utils/
      id.generator.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Cómo lo reutilizan los demás módulos

Cada módulo futuro:

- Extiende `Entity<TId>` para su entidad principal (ej. `Identity extends Entity<IdentityId>`).
- Extiende `ValueObject<TProps>` para sus value objects (ej. `IdentityId`, `AddressType`).
- Usa `generateId()` dentro de sus propios value objects de identificador.
- Puede extender `DomainException` para sus propias excepciones de dominio, si las necesita.

Ningún módulo de negocio modifica `Core`; solo lo consumen.
