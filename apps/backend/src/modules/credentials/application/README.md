# Credentials — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Credentials`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateCredentialCommand`
- `UpdateCredentialCommand`
- `DeleteCredentialCommand`

## Queries

- `GetCredentialQuery`
- `SearchCredentialQuery`
- `ListCredentialQuery`

## Use Cases

Con `CredentialRepository` inyectado por constructor; `execute()` sin
implementar:

- `CreateCredentialUseCase`
- `UpdateCredentialUseCase`
- `DeleteCredentialUseCase`
- `GetCredentialUseCase`

## DTO

- `CreateCredentialDto`
- `UpdateCredentialDto`
- `CredentialDto` (salida)

## Mapper

`CredentialMapper` traduce `Credential` (dominio) → `CredentialDto`. Solo
copia de campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
