# Payment — Application Layer

Estructura preparatoria de la capa Application para el módulo `Payment`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreatePaymentCommand`
- `UpdatePaymentCommand`
- `CancelPaymentCommand`

## Queries

- `GetPaymentQuery`
- `SearchPaymentQuery`
- `ListPaymentQuery`

## Use Cases

Con `PaymentRepository` inyectado por constructor, con lógica real de persistencia:

- `CreatePaymentUseCase`
- `UpdatePaymentUseCase`
- `CancelPaymentUseCase`
- `GetPaymentUseCase`

## DTO

- `CreatePaymentDto`
- `UpdatePaymentDto`
- `PaymentDto` (salida)

## Mapper

`PaymentMapper` traduce `Payment` (dominio) → `PaymentDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
