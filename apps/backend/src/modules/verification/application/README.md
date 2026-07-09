# Verification — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Verification`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateVerificationCommand`
- `UpdateVerificationCommand`

## Queries

- `GetVerificationQuery`
- `SearchVerificationQuery`
- `ListVerificationQuery`

## Use Cases

Con `VerificationRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateVerificationUseCase`
- `UpdateVerificationUseCase`
- `GetVerificationUseCase`

## DTO

- `CreateVerificationDto`
- `UpdateVerificationDto`
- `VerificationDto` (salida)

## Mapper

`VerificationMapper` traduce `Verification` (dominio) → `VerificationDto`.
Solo copia de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, OCR, reconocimiento facial, validaciones, APIs,
controladores, servicios de NestJS, persistencia ni infraestructura.
