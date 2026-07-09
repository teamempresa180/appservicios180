import { Quote } from '../entities/quote.entity';
import { QuoteId } from '../value-objects/quote-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Quote persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface QuoteRepository {
  findById(id: QuoteId): Promise<Quote | null>;
  findByOrderId(orderId: OrderId): Promise<Quote[]>;
  findByProviderId(providerId: ProviderId): Promise<Quote[]>;
  save(quote: Quote): Promise<void>;
}
