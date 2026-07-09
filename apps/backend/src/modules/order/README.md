# Order Module (Backend)

## Qué representa

`Order` modela únicamente la **solicitud de un servicio** que un cliente
(`Identity`) hace a un proveedor (`Provider`) para un servicio concreto
(`Service`): título, descripción, fecha programada, prioridad y estado. Es
dominio puro — solo representa el dato de la solicitud, no su ciclo de vida
operativo.

Campos representados (sin comportamiento, solo datos):

- `OrderId`
- `IdentityId` (cliente, reutilizado de `identity`)
- `ProviderId` (reutilizado de `provider`)
- `ServiceId` (reutilizado de `service`)
- `title`
- `description`
- `scheduledDate`
- `status`
- `priority`
- `createdAt`, `updatedAt`

## Diferencia entre Service y Order

`Service` es la oferta general que un proveedor publica (ej. "Destape de
tubería", con su precio base y duración estimada). `Order` es una solicitud
concreta de esa oferta hecha por un cliente en una fecha determinada. Un
mismo `Service` puede generar muchas `Order` de distintos clientes.

## Diferencia entre Provider y Order

`Provider` es quién presta el servicio (la faceta profesional de una
persona). `Order` es el evento de solicitud entre un cliente y ese
proveedor — no describe al proveedor, solo lo referencia.

## Por qué Order solo referencia IDs

`Order` importa únicamente `IdentityId`, `ProviderId` y `ServiceId` — nunca
las entidades `Identity`, `Provider` o `Service` completas. Esto mantiene el
dominio de `Order` desacoplado de los campos internos de esos módulos.

## Cómo permitirá conectar en el futuro Payments, Quotes, Chat, Scheduling, Tracking, Reviews, Notifications, AI sin modificar este dominio

- **Payments**: referenciará `OrderId` para registrar el cobro asociado.
- **Quotes**: referenciará `OrderId` (o `ServiceId`) para la cotización antes
  de confirmar la solicitud.
- **Chat**: referenciará `OrderId` para agrupar la conversación entre cliente
  y proveedor.
- **Scheduling**: referenciará `OrderId`/`ProviderId` para gestionar agenda y
  disponibilidad real, más allá del campo informativo `scheduledDate`.
- **Tracking**: referenciará `OrderId` para el seguimiento del servicio en
  curso.
- **Reviews**: referenciará `OrderId` para calificar la experiencia una vez
  finalizada la orden.
- **Notifications**: referenciará `OrderId` para notificar cambios de
  estado a cliente y proveedor.
- **AI**: consumirá los datos de `Order` como entrada de solo lectura (por
  ejemplo, para sugerir proveedores similares), sin que este módulo necesite
  saberlo.

En todos los casos, `Order` es referenciado — nunca depende de esos módulos.

## Qué NO contiene

Precio final, cotización, pagos, facturas, chat, mensajes, fotos, archivos,
ubicación, GPS, seguimiento, cancelaciones, historial, reseñas, favoritos,
IA, notificaciones, disponibilidad, APIs, controladores, DTOs, casos de uso,
servicios de aplicación, persistencia.

## Estructura

```
order/
  README.md
  domain/
    entities/
      order.entity.ts
    value-objects/
      order-id.value-object.ts
      order-status.value-object.ts
      order-priority.value-object.ts
    interfaces/
      order-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Order` únicamente referencia `IdentityId` (de `identity`), `ProviderId` (de
`provider`) y `ServiceId` (de `service`) — nunca importa esas entidades
completas. Ninguno de esos módulos conoce `Order`.
