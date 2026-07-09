# Address — Application Layer

Estructura preparatoria de la capa Application para el módulo `Address`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateAddressCommand`
- `UpdateAddressCommand`
- `DeleteAddressCommand`

## Queries

- `GetAddressQuery`
- `SearchAddressQuery`
- `ListAddressQuery`

## Use Cases

Con `AddressRepository` inyectado por constructor; `execute()` sin
implementar:

- `CreateAddressUseCase`
- `UpdateAddressUseCase`
- `DeleteAddressUseCase`
- `GetAddressUseCase`

## DTO

- `CreateAddressDto`
- `UpdateAddressDto`
- `AddressDto` (salida)

## Mapper

`AddressMapper` traduce `Address` (dominio) → `AddressDto`. Solo copia de
campos, sin lógica compleja.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
