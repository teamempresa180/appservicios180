# Payment Module (Flutter)

## Qué representa

`payment` modela únicamente el registro de un pago asociado a una
cotización aceptada: quién paga, a quién, cuánto, por qué método y en qué
estado.

## Diferencia entre Quote y Payment

`Quote` es la propuesta de precio. `Payment` es el registro de que ese monto
fue efectivamente pagado. Una `Quote` aceptada puede tener uno o más
`Payment` asociados.

## Diferencia entre Order y Payment

`Order` es la solicitud de servicio. `Payment` es el evento financiero
derivado de esa solicitud, cotizada, aceptada y pagada.

## Por qué Payment solo referencia IDs

`Payment` importa únicamente `QuoteId`, `OrderId`, `IdentityId` y
`ProviderId` — nunca las entidades completas.

## Cómo permitirá conectar posteriormente Stripe, Wompi, Mercado Pago, PayPal, Facturación, Reembolsos, Comisiones, Wallets sin modificar este dominio

Todos esos módulos futuros (pasarelas de pago, facturación, reembolsos,
comisiones, wallets) referenciarán `PaymentId` desde su propio dominio —
`Payment` nunca necesita conocerlos ni cambiar para soportarlos.

## Qué NO contiene

Pasarelas de pago, transacciones bancarias, transactionId, gatewayResponse,
authorizationCode, facturación, impuestos, comisiones, reembolsos, cuotas,
recibos, wallets, cripto, disputas, chargebacks, logs, historial,
persistencia, widgets/pantallas.

## Estructura

```
payment/
  README.md
  models/
    payment_id.dart
    payment_status.dart
    payment_method.dart
  entities/
    payment.dart
```

## Relaciones

`Payment` únicamente referencia `QuoteId` (de `quote`), `OrderId` (de
`order`), `IdentityId` (de `identity`) y `ProviderId` (de `provider`).
Ninguno de esos módulos conoce `Payment`.
