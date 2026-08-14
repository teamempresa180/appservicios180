import { Caller } from '../../../core/application/caller';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * Intent to update an existing Payment. Plain data — no behavior.
 * `caller` is who is asking: `UpdatePaymentUseCase` only lets the
 * original payer, or an Admin, change the status.
 */
export class UpdatePaymentCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
    public readonly status?: PaymentStatus,
  ) {}
}
