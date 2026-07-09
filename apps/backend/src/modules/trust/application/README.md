# Trust — Application Layer

Estructura preparatoria de la capa Application para el módulo `Trust`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateTrustProfileCommand`
- `UpdateTrustProfileCommand`

## Queries

- `GetTrustQuery`
- `SearchTrustQuery`
- `ListTrustQuery`

## Use Cases

Con `TrustRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateTrustProfileUseCase`
- `UpdateTrustProfileUseCase`
- `GetTrustUseCase`

## DTO

- `CreateTrustProfileDto`
- `UpdateTrustProfileDto`
- `TrustDto` (salida)

## Mapper

`TrustMapper` traduce `Trust` (dominio) → `TrustDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, cálculo de puntaje, validaciones, APIs, controladores,
servicios de NestJS, persistencia ni infraestructura.
