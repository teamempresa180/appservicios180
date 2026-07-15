import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * HTTP response body for the Payment endpoints. Distinct from
 * `application/dto/payment.dto.ts` — see
 * `create-payment.request.dto.ts` for the rationale.
 */
export class PaymentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  quoteId!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  payerIdentityId!: string;

  @ApiProperty()
  receiverProviderId!: string;

  @ApiProperty({ example: 75.0 })
  amount!: number;

  @ApiProperty({ enum: PaymentMethod })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
