import { PaginatedResult } from '../../../core/application/paginated-result';
import { Payment } from '../entities/payment.entity';
import { PaymentId } from '../value-objects/payment-id.value-object';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Payment persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 9: `PrismaPaymentRepository`).
 *
 * `findByQuoteId` returns `Payment[]` (not a single `Payment`) — no
 * 1:1 invariant between `Quote` and `Payment` exists in this
 * repository contract.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `PaymentRepository` implementation by contract
 *  instead of by concrete class. */
export const PAYMENT_REPOSITORY = Symbol('PaymentRepository');

export interface PaymentRepository {
  findById(id: PaymentId): Promise<Payment | null>;
  findByQuoteId(quoteId: QuoteId): Promise<Payment[]>;
  findByOrderId(orderId: OrderId): Promise<Payment[]>;
  findByPayerIdentityId(identityId: IdentityId): Promise<Payment[]>;
  findByReceiverProviderId(providerId: ProviderId): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Payment>>;
  /** Free-text match against `method`. */
  search(term: string): Promise<Payment[]>;
}
