# Availability — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Availability`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateAvailabilityCommand`
- `UpdateAvailabilityCommand`
- `DeleteAvailabilityCommand`

## Queries

- `GetAvailabilityQuery`
- `SearchAvailabilityQuery`
- `ListAvailabilityQuery`

## Use Cases

Con `AvailabilityRepository` inyectado por constructor, con lógica real de persistencia:

- `CreateAvailabilityUseCase`
- `UpdateAvailabilityUseCase`
- `DeleteAvailabilityUseCase`
- `GetAvailabilityUseCase`

## DTO

- `CreateAvailabilityDto`
- `UpdateAvailabilityDto`
- `AvailabilityDto` (salida)

## Mapper

`AvailabilityMapper` traduce `Availability` (dominio) → `AvailabilityDto`.
Solo copia de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
