# Schedule — Application Layer

Estructura preparatoria de la capa Application para el módulo `Schedule`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateScheduleCommand`
- `UpdateScheduleCommand`
- `DeleteScheduleCommand`

## Queries

- `GetScheduleQuery`
- `SearchScheduleQuery`
- `ListScheduleQuery`

## Use Cases

Con `ScheduleRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateScheduleUseCase`
- `UpdateScheduleUseCase`
- `DeleteScheduleUseCase`
- `GetScheduleUseCase`

## DTO

- `CreateScheduleDto`
- `UpdateScheduleDto`
- `ScheduleDto` (salida)

## Mapper

`ScheduleMapper` traduce `Schedule` (dominio) → `ScheduleDto`. Solo copia
de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
