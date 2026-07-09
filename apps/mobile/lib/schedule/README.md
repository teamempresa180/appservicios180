# Schedule Module (Flutter)

## Qué representa

`schedule` modela únicamente un bloque de tiempo específico en la agenda de
un proveedor: fecha/hora de inicio, fecha/hora de fin, tipo y estado.

## Diferencia entre Availability y Schedule

`Availability` es una declaración amplia ("estoy disponible entre estas
fechas"). `Schedule` es la agenda concreta: bloques de tiempo puntuales
dentro de ese rango.

## Diferencia entre Schedule y Order

`Order` es la solicitud de un cliente. `Schedule` es un bloque de tiempo del
proveedor, independiente de si algún cliente lo ha solicitado.

## Por qué Schedule solo referencia ProviderId

`Schedule` importa únicamente `ProviderId` — nunca la entidad completa.

## Cómo permitirá conectar posteriormente Orders, Bookings, Calendar, Notifications, Availability, Google Calendar sin modificar este dominio

Todos esos módulos futuros referenciarán `ScheduleId`/`ProviderId` desde su
propio dominio — `Schedule` nunca necesita conocerlos ni cambiar.

## Qué NO contiene

OrderId, BookingId, PaymentId, ChatId, ReviewId, clientes, reservas,
cancelaciones, Google Calendar, Outlook, zonas horarias avanzadas, IA,
reglas de disponibilidad, repeticiones automáticas, persistencia,
widgets/pantallas.

## Estructura

```
schedule/
  README.md
  models/
    schedule_id.dart
    schedule_status.dart
    schedule_type.dart
  entities/
    schedule.dart
```

## Relaciones

`Schedule` únicamente referencia `ProviderId` (de `provider`). `Provider`
no conoce `Schedule`.
