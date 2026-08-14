import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';

/**
 * HTTP request body for `POST /payments`. Distinct from
 * `application/dto/create-payment.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients. `PaymentHttpMapper` translates
 * between the two.
 *
 * `amount` has a `0.01` floor: a zero or negative payment is not a
 * payment, and nothing downstream rejected one before. Note that
 * `payerIdentityId` being well-formed is not the same as it being
 * *allowed* — `CreatePaymentUseCase` additionally requires it to be
 * the calling Identity.
 */
export class CreatePaymentRequestDto {
  @ApiProperty({
    example: '5f8d0d55-b2c9-4b3a-8f1e-2a7c6d5e4f3b',
    description: 'The id of the accepted Quote this Payment settles.',
  })
  @IsUUID()
  quoteId!: string;

  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'The id of the Order this Payment belongs to.',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({
    example: '3f1c9d5e-6a1b-4f2c-9d3e-8b7a6c5d4e3f',
    description: 'The id of the Identity paying (the customer).',
  })
  @IsUUID()
  payerIdentityId!: string;

  @ApiProperty({
    example: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
    description: 'The id of the Provider receiving the Payment.',
  })
  @IsUUID()
  receiverProviderId!: string;

  @ApiProperty({ example: 75.0, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.Card })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}
