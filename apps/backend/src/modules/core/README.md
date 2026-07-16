# Core Module (Backend)

## Qué representa

`Core` es el **shared kernel** del dominio: no modela ningún concepto de negocio propio.
Provee las piezas estructurales que todos los demás módulos (Identity, Profiles,
Verification, Trust, Audit, Authentication, Credentials, Contact, Address, ...)
reutilizan para mantenerse consistentes entre sí.

Contiene únicamente:

- `Entity<TId>` — clase base para toda entidad de dominio, define identidad y su
  igualdad estructural (dos entidades son iguales si son del mismo tipo y comparten id).
  **22/22 módulos** la extienden en su entidad principal.
- `ValueObject<TProps>` — clase base para todo value object, define igualdad por
  valor de sus propiedades (inmutables). **22/22 módulos** la extienden en su
  `<X>Id` (los value objects `<X>Status`/`<X>Type` son enums de TypeScript, no
  necesitan una clase base — no hay lógica ni igualdad estructural que compartir
  ahí).
- `DomainException` — excepción base abstracta. Extendida hoy por
  `NotFoundException`/`ValidationException`/`BusinessRuleException` (ver abajo,
  Sprint 3 Etapa 1) — la jerarquía oficial que todos los módulos usan desde sus
  Use Cases reales, respaldados por persistencia Prisma.
- `generateId()` — utilidad pura para generar identificadores únicos (UUID v4),
  sin dependencias externas, sin persistencia ni I/O. **22/22 módulos** la usan
  dentro de su `<X>Id.create()`.

### Jerarquía de excepciones (Sprint 3, Etapa 1)

- `NotFoundException` — lookup por id (u otro criterio único) sin resultado.
  Reemplazará el placeholder de cada `get`/`update`/`delete` use case.
- `ValidationException` — dato de entrada mal formado o incompleto. Reemplazará
  el placeholder de cada `create`/`update` use case.
- `BusinessRuleException` — operación bien formada pero que viola un invariante
  de negocio (p. ej. "una Order solo acepta una Quote", ya documentado en
  `PROJECT_STATUS.md` como invariante cruzado sin implementar todavía).

### Qué se evaluó y se decidió NO agregar (Sprint 3, Etapa 1)

Se auditaron los 22 módulos de dominio buscando duplicación real antes de tocar
nada — **ningún módulo tiene todavía un consumidor real** para lo siguiente, así
que no se creó (evita que el Shared Kernel se llene de utilidades genéricas sin
uso, ver `PROJECT_STATUS.md`/`SPRINT3_PREPARATION.md`):

- **`Money`/`Email`/`PhoneNumber`/`DocumentNumber`/`Percentage`/`Rating`**
  (value objects): todo campo equivalente hoy es un primitivo plano —
  `Payment.amount: number`, `Quote.proposedPrice: number`,
  `Contact.value: string`, `Identity.documentNumber: string` — cada uno
  documentado explícitamente como "Pure data holder — no format validation/no
  business rules". Introducir estos value objects ahora no tendría ningún
  consumidor real; se crean cuando el módulo que los necesite implemente esa
  validación de verdad.
- **`AggregateRoot`** (distinta de `Entity`): las 22 entidades principales ya
  se documentan como Aggregate Root a nivel de diseño (`PROJECT_STATUS.md`),
  pero no hay ninguna diferencia de comportamiento que codificar todavía (no
  existen Domain Events que recolectar/despachar) — agregar una subclase vacía
  solo por nombre sería una abstracción sin propósito.
- **`DomainEvent`**: no hay ningún caso de uso que necesite publicar/reaccionar
  a un evento de dominio todavía.
- **`Result`/`Either`/`Failure`**: el dominio ya tiene un mecanismo de manejo de
  errores consistente y en uso (excepciones, ver arriba) — introducir un
  segundo paradigma (monádico) en paralelo dividiría el código entre dos
  estilos sin necesidad real.
- **Validadores (`EmailValidator`/`PhoneValidator`/`DocumentValidator`)**: no
  tienen nada que validar todavía — dependen de que existan los value objects
  correspondientes, que a su vez no están justificados hoy (ver arriba).
- **Utilidades de formato/fecha/dinero**: se revisaron los mappers de
  aplicación existentes (`application/mappers/*.mapper.ts`) buscando lógica
  duplicada — son copias campo a campo sin ningún formato/cálculo, no hay
  nada que extraer todavía.

Si en una etapa futura un módulo necesita real y concretamente alguna de estas
piezas, se agrega entonces — con el consumidor real ya identificado, no antes.

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
      not-found.exception.ts       (nuevo — Sprint 3 Etapa 1)
      validation.exception.ts      (nuevo — Sprint 3 Etapa 1)
      business-rule.exception.ts   (nuevo — Sprint 3 Etapa 1)
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
