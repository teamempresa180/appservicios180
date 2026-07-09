# Profiles — Application Layer

Estructura preparatoria de la capa Application para el módulo `Profiles`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateProfileCommand`
- `UpdateProfileCommand`
- `DeleteProfileCommand`

## Queries

- `GetProfileQuery`
- `SearchProfileQuery`
- `ListProfileQuery`

## Use Cases

Con `ProfileRepository` inyectado por constructor; `execute()` sin implementar:

- `CreateProfileUseCase`
- `UpdateProfileUseCase`
- `DeleteProfileUseCase`
- `GetProfileUseCase`

## DTO

- `CreateProfileDto`
- `UpdateProfileDto`
- `ProfileDto` (salida)

## Mapper

`ProfileMapper` traduce `Profile` (dominio) → `ProfileDto`. Solo copia de
campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
