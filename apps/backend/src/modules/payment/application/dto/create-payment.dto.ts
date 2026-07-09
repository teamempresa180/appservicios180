import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';

/**
 * Input shape for creating a Payment. No validation.
 */
export class CreatePaymentDto {
  quoteId!: string;
  orderId!: string;
  payerIdentityId!: string;
  receiverProviderId!: string;
  amount!: number;
  method!: PaymentMethod;
}
