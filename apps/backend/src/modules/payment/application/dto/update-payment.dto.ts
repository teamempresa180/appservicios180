import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * Input shape for updating a Payment. No validation.
 */
export class UpdatePaymentDto {
  status?: PaymentStatus;
}
