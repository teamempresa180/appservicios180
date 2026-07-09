# Payment Module (Backend)

## Qué representa

`Payment` modela únicamente el **registro de un pago asociado a una
cotización aceptada**: quién paga, a quién, cuánto, por qué método y en qué
estado. Es dominio puro — solo representa el dato del pago, no lo procesa.

Campos representados (sin comportamiento, solo datos):

- `PaymentId`
- `QuoteId` (reutilizado de `quote`)
- `OrderId` (reutilizado de `order`)
- `payerIdentityId` (reutiliza `IdentityId` de `identity`)
- `receiverProviderId` (reutiliza `ProviderId` de `provider`)
- `amount`
- `method`
- `status`
- `createdAt`, `updatedAt`

## Diferencia entre Quote y Payment

`Quote` es la propuesta de precio que un proveedor envía. `Payment` es el
registro de que ese monto (u otro derivado de la cotización aceptada) fue
efectivamente pagado. Una `Quote` aceptada puede tener uno o más `Payment`
asociados (por ejemplo, si se paga en partes) sin que `Quote` cambie.

## Diferencia entre Order y Payment

`Order` es la solicitud de servicio. `Payment` es el evento financiero
derivado de que esa solicitud fue cotizada, aceptada y pagada — referencia
la orden, pero no describe el servicio en sí.

## Por qué Payment solo referencia IDs

`Payment` importa únicamente `QuoteId`, `OrderId`, `IdentityId` y
`ProviderId` — nunca las entidades `Quote`, `Order`, `Identity` o `Provider`
completas. Esto mantiene el dominio de `Payment` desacoplado de los campos
internos de esos módulos.

## Cómo permitirá conectar posteriormente Stripe, Wompi, Mercado Pago, PayPal, Facturación, Reembolsos, Comisiones, Wallets sin modificar este dominio

- **Pasarelas de pago** (Stripe, Wompi, Mercado Pago, PayPal): un módulo de
  infraestructura futuro implementará la integración real y referenciará
  `PaymentId` para vincular la transacción externa — sin que este módulo de
  dominio conozca ninguna pasarela.
- **Facturación**: referenciará `PaymentId` para emitir el comprobante.
- **Reembolsos**: un módulo futuro que referenciará `PaymentId` para
  registrar la devolución, sin que `Payment` necesite campos de reembolso.
- **Comisiones**: referenciará `PaymentId` para calcular y registrar la
  comisión de la plataforma.
- **Wallets**: referenciará `payerIdentityId`/`receiverProviderId` para
  saldos internos, sin acoplarse a este dominio.

En todos los casos, `Payment` es referenciado — nunca depende de esos
módulos.

## Qué NO contiene

Pasarelas de pago, transacciones bancarias, `transactionId`,
`gatewayResponse`, `authorizationCode`, facturación, impuestos, comisiones,
reembolsos, cuotas/installments, recibos, wallets, cripto, disputas,
chargebacks, logs, historial, APIs, controladores, DTOs, casos de uso,
servicios de aplicación, persistencia.

## Estructura

```
payment/
  README.md
  domain/
    entities/
      payment.entity.ts
    value-objects/
      payment-id.value-object.ts
      payment-status.value-object.ts
      payment-method.value-object.ts
    interfaces/
      payment-repository.interface.ts
  application/   (reservado, vacío)
  infrastructure/ (reservado, vacío)
  presentation/   (reservado, vacío)
```

## Relaciones

`Payment` únicamente referencia `QuoteId` (de `quote`), `OrderId` (de
`order`), `IdentityId` (de `identity`) y `ProviderId` (de `provider`) —
nunca importa esas entidades completas. Ninguno de esos módulos conoce
`Payment`.
