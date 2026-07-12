import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentRepository } from '../../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../../domain/value-objects/payment-id.value-object';

/** In-memory `PaymentRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly rows = new Map<string, Payment>();

  findById(id: PaymentId): Promise<Payment | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByQuoteId(quoteId: QuoteId): Promise<Payment[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.quoteId.equals(quoteId)),
    );
  }

  findByOrderId(orderId: OrderId): Promise<Payment[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.orderId.equals(orderId)),
    );
  }

  findByPayerIdentityId(identityId: IdentityId): Promise<Payment[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.payerIdentityId.equals(identityId),
      ),
    );
  }

  findByReceiverProviderId(providerId: ProviderId): Promise<Payment[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.receiverProviderId.equals(providerId),
      ),
    );
  }

  save(payment: Payment): Promise<void> {
    this.rows.set(payment.id.value, payment);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Payment>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Payment[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.method.toLowerCase().includes(lower),
      ),
    );
  }
}
