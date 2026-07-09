# Identity — Application Layer

Estructura preparatoria de la capa Application para el módulo `Identity`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas, listos para que una
fase posterior implemente la orquestación.

## Commands

Intenciones de escritura, sin comportamiento (solo datos):

- `CreateIdentityCommand`
- `UpdateIdentityCommand`
- `DeleteIdentityCommand`

## Queries

Intenciones de lectura, sin comportamiento (solo datos):

- `GetIdentityQuery`
- `SearchIdentityQuery`
- `ListIdentityQuery`

## Use Cases

Clases con el repositorio de dominio (`IdentityRepository`) inyectado por
constructor. El método `execute()` está intencionalmente sin implementar en
esta fase:

- `CreateIdentityUseCase`
- `UpdateIdentityUseCase`
- `DeleteIdentityUseCase`
- `GetIdentityUseCase`

## DTO

Formas de datos planas para entrada/salida, sin validaciones:

- `CreateIdentityDto`
- `UpdateIdentityDto`
- `IdentityDto` (salida)

## Mapper

`IdentityMapper` traduce la entidad de dominio `Identity` hacia `IdentityDto`
(dirección Domain → DTO). Solo copia de campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
