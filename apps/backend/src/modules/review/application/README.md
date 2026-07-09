# Review — Application Layer

Estructura preparatoria de la capa Application para el módulo `Review`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateReviewCommand`
- `UpdateReviewCommand`
- `DeleteReviewCommand`

## Queries

- `GetReviewQuery`
- `SearchReviewQuery`
- `ListReviewQuery`

## Use Cases

Con `ReviewRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateReviewUseCase`
- `UpdateReviewUseCase`
- `DeleteReviewUseCase`
- `GetReviewUseCase`

## DTO

- `CreateReviewDto`
- `UpdateReviewDto`
- `ReviewDto` (salida)

## Mapper

`ReviewMapper` traduce `Review` (dominio) → `ReviewDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
