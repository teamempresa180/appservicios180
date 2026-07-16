# Quote — Application Layer

Estructura preparatoria de la capa Application para el módulo `Quote`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateQuoteCommand`
- `UpdateQuoteCommand`
- `AcceptQuoteCommand`
- `RejectQuoteCommand`

## Queries

- `GetQuoteQuery`
- `SearchQuoteQuery`
- `ListQuoteQuery`

## Use Cases

Con `QuoteRepository` inyectado por constructor, con lógica real de persistencia:

- `CreateQuoteUseCase`
- `UpdateQuoteUseCase`
- `AcceptQuoteUseCase`
- `RejectQuoteUseCase`
- `GetQuoteUseCase`

## DTO

- `CreateQuoteDto`
- `UpdateQuoteDto`
- `QuoteDto` (salida)

## Mapper

`QuoteMapper` traduce `Quote` (dominio) → `QuoteDto`. Solo copia de campos,
sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
