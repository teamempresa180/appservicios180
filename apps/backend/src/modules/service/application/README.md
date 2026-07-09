# Service — Application Layer

Estructura preparatoria de la capa Application para el módulo `Service`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateServiceCommand`
- `UpdateServiceCommand`
- `DeleteServiceCommand`

## Queries

- `GetServiceQuery`
- `SearchServiceQuery`
- `ListServiceQuery`

## Use Cases

Con `ServiceRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateServiceUseCase`
- `UpdateServiceUseCase`
- `DeleteServiceUseCase`
- `GetServiceUseCase`

## DTO

- `CreateServiceDto`
- `UpdateServiceDto`
- `ServiceDto` (salida)

## Mapper

`ServiceMapper` traduce `Service` (dominio) → `ServiceDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
