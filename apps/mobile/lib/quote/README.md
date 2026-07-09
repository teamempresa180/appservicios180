# Quote Module (Flutter)

## Qué representa

`quote` modela únicamente una cotización que un proveedor envía como
respuesta a una orden: precio propuesto, duración estimada, notas, tipo y
estado.

## Diferencia entre Order y Quote

`Order` es la solicitud original del cliente. `Quote` es la respuesta de un
proveedor a esa solicitud, con un precio y condiciones propuestas.

## Diferencia entre Service y Quote

`Service` es la oferta general y su precio base referencial. `Quote` es el
precio concreto que un proveedor propone para una orden específica.

## Por qué Quote solo referencia IDs

`Quote` importa únicamente `OrderId` y `ProviderId` — nunca las entidades
completas.

## Cómo permitirá conectar en el futuro Payment, Invoice, Contract, Chat, Negotiation, Notifications, AI Pricing sin modificar este dominio

Todos esos módulos futuros referenciarán `QuoteId` desde su propio dominio —
`Quote` nunca necesita conocerlos ni cambiar para soportarlos.

## Qué NO contiene

Pagos, descuentos, impuestos, monedas, contratos, archivos, imágenes,
firmas, aceptación automática, historial, IA, chat, revisiones, versiones,
ubicación, persistencia, widgets/pantallas.

## Estructura

```
quote/
  README.md
  models/
    quote_id.dart
    quote_status.dart
    quote_type.dart
  entities/
    quote.dart
```

## Relaciones

`Quote` únicamente referencia `OrderId` (de `order`) y `ProviderId` (de
`provider`). Ninguno de esos módulos conoce `Quote`.
