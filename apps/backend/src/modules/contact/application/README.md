# Contact — Application Layer

Estructura preparatoria de la capa Application para el módulo `Contact`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateContactCommand`
- `UpdateContactCommand`
- `DeleteContactCommand`

## Queries

- `GetContactQuery`
- `SearchContactQuery`
- `ListContactQuery`

## Use Cases

Con `ContactRepository` inyectado por constructor; `execute()` sin
implementar:

- `CreateContactUseCase`
- `UpdateContactUseCase`
- `DeleteContactUseCase`
- `GetContactUseCase`

## DTO

- `CreateContactDto`
- `UpdateContactDto`
- `ContactDto` (salida)

## Mapper

`ContactMapper` traduce `Contact` (dominio) → `ContactDto`. Solo copia de
campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
