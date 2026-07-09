# Availability Module (Backend)

## Qué representa

`Availability` modela únicamente la **disponibilidad general** de un
proveedor para prestar servicios: un rango de fechas (`availableFrom` /
`availableTo`), un tipo y un estado. Es dominio puro — solo representa que
el proveedor está disponible en términos amplios, no su agenda operativa.

Campos representados (sin comportamiento, solo datos):

- `AvailabilityId`
- `ProviderId` (reutilizado de `provider`)
- `status`
- `type`
- `availableFrom`
- `availableTo`
- `createdAt`, `updatedAt`

## Diferencia entre Availability y Schedule

`Availability` es una declaración amplia ("estoy disponible entre estas
fechas"). `Schedule` (módulo futuro) representará los horarios específicos
día a día, franjas horarias y excepciones — información mucho más granular
que este módulo nunca contendrá.

## Diferencia entre Availability y Order

`Order` es la solicitud concreta de un cliente para un servicio en una fecha
determinada. `Availability` es una condición general del proveedor,
independiente de cualquier solicitud puntual — no referencia órdenes ni
sabe si existen.

## Por qué Availability solo referencia ProviderId

`Availability` importa únicamente `ProviderId` — nunca la entidad
`Provider` completa. Esto mantiene el dominio de `Availability` desacoplado
de los campos internos de `provider`.

## Cómo permitirá conectar posteriormente Schedule, Bookings, Calendar, Notifications, Orders sin modificar este dominio

- **Schedule**: referenciará `ProviderId` (y posiblemente
  `AvailabilityId`) para definir horarios específicos dentro del rango
  general declarado aquí.
- **Bookings**: referenciará `ProviderId`/`AvailabilityId` para verificar
  que existe disponibilidad general antes de reservar un horario concreto.
- **Calendar**: consumirá `Availability` como entrada de solo lectura para
  construir vistas de calendario.
- **Notifications**: referenciará `AvailabilityId` para avisar cambios de
  disponibilidad.
- **Orders**: podrá cruzar `ProviderId` con `Availability` para sugerir
  proveedores disponibles, sin que este módulo conozca `Order`.

En todos los casos, `Availability` es referenciada — nunca depende de esos
módulos.

## Qué NO contiene

Agenda, reservas, horarios específicos, calendario, citas, órdenes, chat,
pagos, GPS, ubicación, zonas, vacaciones, excepciones, reglas de negocio,
APIs, controladores, DTOs, casos de uso, servicios de aplicación,
persistencia.

## Estructura

```
availability/
  README.md
  domain/
    entities/
      availability.entity.ts
    value-objects/
      availability-id.value-object.ts
      availability-status.value-object.ts
      availability-type.value-object.ts
    interfaces/
      availability-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Availability` únicamente referencia `ProviderId` (de `provider`) — nunca
importa esa entidad completa. `Provider` no conoce `Availability`.
