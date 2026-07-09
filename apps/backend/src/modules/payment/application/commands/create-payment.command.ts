import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';

/**
 * Intent to create a new Payment. Plain data — no behavior.
 */
export class CreatePaymentCommand {
  constructor(
    public readonly quoteId: string,
    public readonly orderId: string,
    public readonly payerIdentityId: string,
    public readonly receiverProviderId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
  ) {}
}
