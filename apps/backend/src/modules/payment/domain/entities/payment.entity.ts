import { Entity } from '../../../core/domain/base/entity.base';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { PaymentId } from '../value-objects/payment-id.value-object';
import { PaymentMethod } from '../value-objects/payment-method.value-object';
import { PaymentStatus } from '../value-objects/payment-status.value-object';

export interface PaymentProps {
  quoteId: QuoteId;
  orderId: OrderId;
  payerIdentityId: IdentityId;
  receiverProviderId: ProviderId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the record of a payment associated with an accepted quote.
 * Pure data holder — no payment gateways, no bank transactions, no
 * invoicing, no refunds, no reconciliation, no persistence, no business rules.
 */
export class Payment extends Entity<PaymentId> {
  public readonly quoteId: QuoteId;
  public readonly orderId: OrderId;
  public readonly payerIdentityId: IdentityId;
  public readonly receiverProviderId: ProviderId;
  public readonly amount: number;
  public readonly method: PaymentMethod;
  public readonly status: PaymentStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: PaymentId, props: PaymentProps) {
    super(id);
    this.quoteId = props.quoteId;
    this.orderId = props.orderId;
    this.payerIdentityId = props.payerIdentityId;
    this.receiverProviderId = props.receiverProviderId;
    this.amount = props.amount;
    this.method = props.method;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
