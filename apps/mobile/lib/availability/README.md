# Availability Module (Flutter)

## Qué representa

`availability` modela únicamente la disponibilidad general de un proveedor
para prestar servicios: un rango de fechas, un tipo y un estado.

## Diferencia entre Availability y Schedule

`Availability` es una declaración amplia. `Schedule` (módulo futuro)
representará horarios específicos día a día y excepciones.

## Diferencia entre Availability y Order

`Order` es la solicitud concreta de un cliente en una fecha determinada.
`Availability` es una condición general del proveedor, independiente de
cualquier solicitud puntual.

## Por qué Availability solo referencia ProviderId

`Availability` importa únicamente `ProviderId` — nunca la entidad completa.

## Cómo permitirá conectar posteriormente Schedule, Bookings, Calendar, Notifications, Orders sin modificar este dominio

Todos esos módulos futuros referenciarán `ProviderId`/`AvailabilityId` desde
su propio dominio — `Availability` nunca necesita conocerlos ni cambiar.

## Qué NO contiene

Agenda, reservas, horarios específicos, calendario, citas, órdenes, chat,
pagos, GPS, ubicación, zonas, vacaciones, excepciones, reglas de negocio,
persistencia, widgets/pantallas.

## Estructura

```
availability/
  README.md
  models/
    availability_id.dart
    availability_status.dart
    availability_type.dart
  entities/
    availability.dart
```

## Relaciones

`Availability` únicamente referencia `ProviderId` (de `provider`).
`Provider` no conoce `Availability`.
