# Message — Application Layer

Estructura preparatoria de la capa Application para el módulo `Message`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `SendMessageCommand`
- `DeleteMessageCommand`

## Queries

- `GetMessageQuery`
- `SearchMessageQuery`
- `ListMessageQuery`

## Use Cases

Con `MessageRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `SendMessageUseCase`
- `DeleteMessageUseCase`
- `GetMessageUseCase`

## DTO

- `SendMessageDto`
- `MessageDto` (salida)

## Mapper

`MessageMapper` traduce `Message` (dominio) → `MessageDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
