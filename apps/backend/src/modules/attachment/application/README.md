# Attachment — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Attachment`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateAttachmentCommand`
- `DeleteAttachmentCommand`

## Queries

- `GetAttachmentQuery`
- `SearchAttachmentQuery`
- `ListAttachmentQuery`

## Use Cases

Con `AttachmentRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateAttachmentUseCase`
- `DeleteAttachmentUseCase`
- `GetAttachmentUseCase`

## DTO

- `CreateAttachmentDto`
- `AttachmentDto` (salida)

## Mapper

`AttachmentMapper` traduce `Attachment` (dominio) → `AttachmentDto`. Solo
copia de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
