# Schedule Module (Backend)

## Qué representa

`Schedule` modela únicamente un **bloque de tiempo específico** en la agenda
de un proveedor: fecha/hora de inicio, fecha/hora de fin, tipo y estado. Es
dominio puro — solo representa el bloque, no gestiona reservas ni sincroniza
con calendarios externos.

Campos representados (sin comportamiento, solo datos):

- `ScheduleId`
- `ProviderId` (reutilizado de `provider`)
- `startDateTime`
- `endDateTime`
- `status`
- `type`
- `createdAt`, `updatedAt`

## Diferencia entre Availability y Schedule

`Availability` (módulo anterior) es una declaración amplia del proveedor
("estoy disponible entre estas fechas"). `Schedule` es la agenda concreta:
bloques de tiempo puntuales dentro de ese rango general. `Availability`
responde "¿en qué período trabajo?"; `Schedule` responde "¿qué bloques
específicos tengo definidos?".

## Diferencia entre Schedule y Order

`Order` es la solicitud de un cliente para un servicio. `Schedule` es un
bloque de tiempo del proveedor, independiente de si algún cliente lo ha
solicitado — no referencia `OrderId` ni sabe si existen órdenes.

## Por qué Schedule solo referencia ProviderId

`Schedule` importa únicamente `ProviderId` — nunca la entidad `Provider`
completa. Esto mantiene el dominio de `Schedule` desacoplado de los campos
internos de `provider`.

## Cómo permitirá conectar posteriormente Orders, Bookings, Calendar, Notifications, Availability, Google Calendar sin modificar este dominio

- **Orders**: un futuro cruce entre `Order` y `Schedule` (por `ProviderId`)
  podrá verificar qué bloques están libres, sin que `Schedule` conozca
  `Order`.
- **Bookings**: un módulo futuro que referenciará `ScheduleId` para marcar
  un bloque como reservado, sin que `Schedule` tenga campos de reserva.
- **Calendar**: consumirá `Schedule` como entrada de solo lectura para
  construir vistas de calendario.
- **Notifications**: referenciará `ScheduleId` para recordatorios.
- **Availability**: podrá cruzarse con `Schedule` por `ProviderId` para
  validar que los bloques caen dentro del rango general declarado.
- **Google Calendar**: una integración de infraestructura futura podrá
  sincronizar `Schedule` con calendarios externos referenciando
  `ScheduleId`, sin que este dominio conozca ningún proveedor de calendario.

En todos los casos, `Schedule` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

`OrderId`, `BookingId`, `PaymentId`, `ChatId`, `ReviewId`, clientes,
reservas, cancelaciones, Google Calendar, Outlook, zonas horarias
avanzadas, IA, reglas de disponibilidad, repeticiones automáticas, APIs,
controladores, DTOs, casos de uso, servicios de aplicación, persistencia.

## Estructura

```
schedule/
  README.md
  domain/
    entities/
      schedule.entity.ts
    value-objects/
      schedule-id.value-object.ts
      schedule-status.value-object.ts
      schedule-type.value-object.ts
    interfaces/
      schedule-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Schedule` únicamente referencia `ProviderId` (de `provider`) — nunca
importa esa entidad completa. `Provider` no conoce `Schedule`.
