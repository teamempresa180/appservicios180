# Authentication — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Authentication`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateAuthenticationCommand`
- `UpdateAuthenticationCommand`
- `DeleteAuthenticationCommand`

## Queries

- `GetAuthenticationQuery`
- `SearchAuthenticationQuery`
- `ListAuthenticationQuery`

## Use Cases

Con `AuthenticationRepository` inyectado por constructor; `execute()` sin
implementar:

- `CreateAuthenticationUseCase`
- `UpdateAuthenticationUseCase`
- `DeleteAuthenticationUseCase`
- `GetAuthenticationUseCase`

## DTO

- `CreateAuthenticationDto`
- `UpdateAuthenticationDto`
- `AuthenticationDto` (salida)

## Mapper

`AuthenticationMapper` traduce `Authentication` (dominio) →
`AuthenticationDto`. Solo copia de campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
