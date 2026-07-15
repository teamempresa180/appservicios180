import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';

/**
 * HTTP request body for `POST /payments`. Distinct from
 * `application/dto/create-payment.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `PaymentHttpMapper` translates
 * between the two.
 */
export class CreatePaymentRequestDto {
  @ApiProperty({
    example: 'quote-id-123',
    description: 'The id of the accepted Quote this Payment settles.',
  })
  quoteId!: string;

  @ApiProperty({
    example: 'order-id-123',
    description: 'The id of the Order this Payment belongs to.',
  })
  orderId!: string;

  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity paying (the customer).',
  })
  payerIdentityId!: string;

  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider receiving the Payment.',
  })
  receiverProviderId!: string;

  @ApiProperty({ example: 75.0 })
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.Card })
  method!: PaymentMethod;
}
