import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class PaymentDto {
  id!: string;
  quoteId!: string;
  orderId!: string;
  payerIdentityId!: string;
  receiverProviderId!: string;
  amount!: number;
  method!: PaymentMethod;
  status!: PaymentStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
