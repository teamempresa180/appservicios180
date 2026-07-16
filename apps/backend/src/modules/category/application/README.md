# Category — Application Layer

Estructura preparatoria de la capa Application para el módulo `Category`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateCategoryCommand`
- `UpdateCategoryCommand`
- `DeleteCategoryCommand`

## Queries

- `GetCategoryQuery`
- `SearchCategoryQuery`
- `ListCategoryQuery`

## Use Cases

Con `CategoryRepository` inyectado por constructor, con lógica real de persistencia:

- `CreateCategoryUseCase`
- `UpdateCategoryUseCase`
- `DeleteCategoryUseCase`
- `GetCategoryUseCase`

## DTO

- `CreateCategoryDto`
- `UpdateCategoryDto`
- `CategoryDto` (salida)

## Mapper

`CategoryMapper` traduce `Category` (dominio) → `CategoryDto`. Solo copia
de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
