import { Payment } from '../entities/payment.entity';
import { PaymentId } from '../value-objects/payment-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Payment persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface PaymentRepository {
  findById(id: PaymentId): Promise<Payment | null>;
  findByQuoteId(quoteId: QuoteId): Promise<Payment[]>;
  findByOrderId(orderId: OrderId): Promise<Payment[]>;
  findByPayerIdentityId(identityId: IdentityId): Promise<Payment[]>;
  findByReceiverProviderId(providerId: ProviderId): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
}
