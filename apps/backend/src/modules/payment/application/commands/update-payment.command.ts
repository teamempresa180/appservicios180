import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * Intent to update an existing Payment. Plain data — no behavior.
 */
export class UpdatePaymentCommand {
  constructor(
    public readonly id: string,
    public readonly status?: PaymentStatus,
  ) {}
}
