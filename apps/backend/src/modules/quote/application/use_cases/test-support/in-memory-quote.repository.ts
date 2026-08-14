import { PaginatedResult } from '../../../../core/application/paginated-result';
import { OrderId } from '../../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../../domain/entities/quote.entity';
import { QuoteRepository } from '../../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../../domain/value-objects/quote-id.value-object';

/** In-memory `QuoteRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryQuoteRepository implements QuoteRepository {
  private readonly rows = new Map<string, Quote>();

  findById(id: QuoteId): Promise<Quote | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByOrderId(orderId: OrderId): Promise<Quote[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.orderId.equals(orderId)),
    );
  }

  findByOrderIds(orderIds: OrderId[]): Promise<Quote[]> {
    const wanted = new Set(orderIds.map((orderId) => orderId.value));
    return Promise.resolve(
      [...this.rows.values()].filter((row) => wanted.has(row.orderId.value)),
    );
  }

  findByProviderId(providerId: ProviderId): Promise<Quote[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  save(quote: Quote): Promise<void> {
    this.rows.set(quote.id.value, quote);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Quote>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Quote[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.notes.toLowerCase().includes(lower),
      ),
    );
  }
}
