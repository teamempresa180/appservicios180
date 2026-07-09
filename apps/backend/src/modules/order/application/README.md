# Order — Application Layer

Estructura preparatoria de la capa Application para el módulo `Order`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateOrderCommand`
- `UpdateOrderCommand`
- `CancelOrderCommand`

## Queries

- `GetOrderQuery`
- `SearchOrderQuery`
- `ListOrderQuery`

## Use Cases

Con `OrderRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateOrderUseCase`
- `UpdateOrderUseCase`
- `CancelOrderUseCase`
- `GetOrderUseCase`

## DTO

- `CreateOrderDto`
- `UpdateOrderDto`
- `OrderDto` (salida)

## Mapper

`OrderMapper` traduce `Order` (dominio) → `OrderDto`. Solo copia de campos,
sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
