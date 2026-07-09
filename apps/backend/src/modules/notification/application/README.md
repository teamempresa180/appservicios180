# Notification — Application Layer

Estructura preparatoria de la capa Application para el módulo
`Notification`. Ninguna clase aquí implementa lógica de negocio ni
persistencia real — son esqueletos con las dependencias correctamente
tipadas.

## Commands

- `CreateNotificationCommand`
- `MarkNotificationAsReadCommand`
- `DeleteNotificationCommand`

## Queries

- `GetNotificationQuery`
- `SearchNotificationQuery`
- `ListNotificationQuery`

## Use Cases

Con `NotificationRepository` inyectado por constructor; `execute()` lanza
explícitamente `Error("Not implemented yet")`:

- `CreateNotificationUseCase`
- `MarkNotificationAsReadUseCase`
- `DeleteNotificationUseCase`
- `GetNotificationUseCase`

## DTO

- `CreateNotificationDto`
- `NotificationDto` (salida)

## Mapper

`NotificationMapper` traduce `Notification` (dominio) → `NotificationDto`.
Solo copia de campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
