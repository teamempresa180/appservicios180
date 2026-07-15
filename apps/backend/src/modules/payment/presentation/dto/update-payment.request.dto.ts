import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * HTTP request body for `PUT /payments/:id`. Distinct from
 * `application/dto/update-payment.dto.ts` — see
 * `create-payment.request.dto.ts` for the rationale. Only mirrors the
 * field `UpdatePaymentCommand` actually accepts (`status`) — this is
 * the existing Application layer contract, not a new one.
 */
export class UpdatePaymentRequestDto {
  @ApiPropertyOptional({
    enum: PaymentStatus,
    example: PaymentStatus.Completed,
  })
  status?: PaymentStatus;
}
