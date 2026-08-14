import { PaginatedResult } from '../../../core/application/paginated-result';
import { TransactionContext } from '../../../core/domain/ports/transaction-context';
import { Quote } from '../entities/quote.entity';
import { QuoteId } from '../value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Quote persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 8: `PrismaQuoteRepository`).
 *
 * `findByOrderId` returns `Quote[]` (not a single `Quote`) — an Order
 * can receive multiple Quotes from different Providers. No 1:1
 * invariant between `Order` and `Quote` exists in this repository
 * contract.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `QuoteRepository` implementation by contract
 *  instead of by concrete class. */
export const QUOTE_REPOSITORY = Symbol('QuoteRepository');

export interface QuoteRepository {
  findById(id: QuoteId): Promise<Quote | null>;
  findByOrderId(orderId: OrderId): Promise<Quote[]>;
  /** Every Quote submitted for any of the given Orders, in one query.
   *  What the scoped `GET /quotes` needs to show a customer the
   *  Quotes across all of their own Orders without a `findByOrderId`
   *  call per Order. Returns `[]` for an empty input. */
  findByOrderIds(orderIds: OrderId[]): Promise<Quote[]>;
  findByProviderId(providerId: ProviderId): Promise<Quote[]>;
  /** `tx`, when provided (see `TransactionRunner`), scopes this write
   *  to an in-flight transaction — used by `AcceptQuoteUseCase`. */
  save(quote: Quote, tx?: TransactionContext): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Quote>>;
  /** Free-text match against `notes`. */
  search(term: string): Promise<Quote[]>;
}
