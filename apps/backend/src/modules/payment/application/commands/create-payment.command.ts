import { Caller } from '../../../core/application/caller';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';

/**
 * Intent to create a new Payment. Plain data — no behavior. `caller`
 * is who is asking: `CreatePaymentUseCase` requires `payerIdentityId`
 * to be that same caller, so nobody can file a payment record in
 * someone else's name.
 */
export class CreatePaymentCommand {
  constructor(
    public readonly quoteId: string,
    public readonly orderId: string,
    public readonly payerIdentityId: string,
    public readonly receiverProviderId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public readonly caller: Caller,
  ) {}
}
