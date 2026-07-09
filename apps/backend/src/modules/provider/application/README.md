# Provider — Application Layer

Estructura preparatoria de la capa Application para el módulo `Provider`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateProviderCommand`
- `UpdateProviderCommand`
- `DeleteProviderCommand`

## Queries

- `GetProviderQuery`
- `SearchProviderQuery`
- `ListProviderQuery`

## Use Cases

Con `ProviderRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateProviderUseCase`
- `UpdateProviderUseCase`
- `DeleteProviderUseCase`
- `GetProviderUseCase`

## DTO

- `CreateProviderDto`
- `UpdateProviderDto`
- `ProviderDto` (salida)

## Mapper

`ProviderMapper` traduce `Provider` (dominio) → `ProviderDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
