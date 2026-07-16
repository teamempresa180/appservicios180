# Chat — Application Layer

Estructura preparatoria de la capa Application para el módulo `Chat`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateChatCommand`
- `CloseChatCommand`

## Queries

- `GetChatQuery`
- `SearchChatQuery`
- `ListChatQuery`

## Use Cases

Con `ChatRepository` inyectado por constructor, con lógica real de persistencia:

- `CreateChatUseCase`
- `CloseChatUseCase`
- `GetChatUseCase`

## DTO

- `CreateChatDto`
- `ChatDto` (salida)

## Mapper

`ChatMapper` traduce `Chat` (dominio) → `ChatDto`. Solo copia de campos,
sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
