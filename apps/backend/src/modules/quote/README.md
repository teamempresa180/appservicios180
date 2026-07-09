# Quote Module (Backend)

## Qué representa

`Quote` modela únicamente una **cotización que un proveedor envía como
respuesta a una orden**: precio propuesto, duración estimada, notas, tipo y
estado. Es dominio puro — solo representa el dato de la propuesta, no su
negociación ni aceptación.

Campos representados (sin comportamiento, solo datos):

- `QuoteId`
- `OrderId` (reutilizado de `order`)
- `ProviderId` (reutilizado de `provider`)
- `proposedPrice`
- `estimatedDuration`
- `notes`
- `status`
- `type`
- `createdAt`, `updatedAt`

## Diferencia entre Order y Quote

`Order` es la solicitud original del cliente (qué servicio, para cuándo).
`Quote` es la respuesta de un proveedor a esa solicitud, con un precio y
condiciones propuestas. Una misma `Order` puede recibir varias `Quote` de
distintos proveedores (o del mismo, si vuelve a cotizar).

## Diferencia entre Service y Quote

`Service` es la oferta general y su precio base (referencial). `Quote` es el
precio concreto que un proveedor propone para una orden específica — puede
diferir del `basePrice` de `Service`, ya que responde a las condiciones
particulares de esa `Order`.

## Por qué Quote solo referencia IDs

`Quote` importa únicamente `OrderId` y `ProviderId` — nunca las entidades
`Order` o `Provider` completas. Esto mantiene el dominio de `Quote`
desacoplado de los campos internos de esos módulos.

## Cómo permitirá conectar en el futuro Payment, Invoice, Contract, Chat, Negotiation, Notifications, AI Pricing sin modificar este dominio

- **Payment**: referenciará `QuoteId` (una vez aceptada) para procesar el
  cobro.
- **Invoice**: referenciará `QuoteId`/`OrderId` para generar la factura.
- **Contract**: referenciará `QuoteId` para formalizar el acuerdo.
- **Chat**: referenciará `OrderId`/`QuoteId` para la conversación sobre la
  propuesta.
- **Negotiation**: un módulo futuro que referenciará `QuoteId` para
  registrar contraofertas, sin que `Quote` necesite campos de negociación.
- **Notifications**: referenciará `QuoteId` para notificar cambios de
  estado.
- **AI Pricing**: consumirá los datos de `Quote` (precio propuesto,
  duración) como entrada de solo lectura para sugerir precios, sin que este
  módulo lo sepa.

En todos los casos, `Quote` es referenciado — nunca depende de esos módulos.

## Qué NO contiene

Pagos, descuentos, impuestos, monedas, contratos, archivos, imágenes,
firmas, aceptación automática, historial, IA, chat, revisiones, versiones,
ubicación, APIs, controladores, DTOs, casos de uso, servicios de aplicación,
persistencia.

## Estructura

```
quote/
  README.md
  domain/
    entities/
      quote.entity.ts
    value-objects/
      quote-id.value-object.ts
      quote-status.value-object.ts
      quote-type.value-object.ts
    interfaces/
      quote-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Quote` únicamente referencia `OrderId` (de `order`) y `ProviderId` (de
`provider`) — nunca importa esas entidades completas. Ninguno de esos
módulos conoce `Quote`.
