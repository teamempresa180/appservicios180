# Order Module (Flutter)

## Qué representa

`order` modela únicamente la solicitud de un servicio que un cliente hace a
un proveedor para un servicio concreto: título, descripción, fecha
programada, prioridad y estado.

## Diferencia entre Service y Order

`Service` es la oferta general que un proveedor publica. `Order` es una
solicitud concreta de esa oferta hecha por un cliente en una fecha
determinada.

## Diferencia entre Provider y Order

`Provider` es quién presta el servicio. `Order` es el evento de solicitud
entre un cliente y ese proveedor — no describe al proveedor, solo lo
referencia.

## Por qué Order solo referencia IDs

`Order` importa únicamente `IdentityId`, `ProviderId` y `ServiceId` — nunca
las entidades completas.

## Cómo permitirá conectar en el futuro Payments, Quotes, Chat, Scheduling, Tracking, Reviews, Notifications, AI sin modificar este dominio

Todos esos módulos futuros referenciarán `OrderId` desde su propio dominio —
`Order` nunca necesita conocerlos ni cambiar para soportarlos.

## Qué NO contiene

Precio final, cotización, pagos, facturas, chat, mensajes, fotos, archivos,
ubicación, GPS, seguimiento, cancelaciones, historial, reseñas, favoritos,
IA, notificaciones, disponibilidad, persistencia, widgets/pantallas.

## Estructura

```
order/
  README.md
  models/
    order_id.dart
    order_status.dart
    order_priority.dart
  entities/
    order.dart
```

## Relaciones

`Order` únicamente referencia `IdentityId` (de `identity`), `ProviderId` (de
`provider`) y `ServiceId` (de `service`). Ninguno de esos módulos conoce
`Order`.
