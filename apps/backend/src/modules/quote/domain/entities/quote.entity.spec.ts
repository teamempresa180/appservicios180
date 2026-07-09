import { Quote } from './quote.entity';
import { QuoteId } from '../value-objects/quote-id.value-object';
import { QuoteStatus } from '../value-objects/quote-status.value-object';
import { QuoteType } from '../value-objects/quote-type.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('Quote', () => {
  it('holds all the assigned properties', () => {
    const id = QuoteId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const quote = new Quote(id, {
      orderId,
      providerId,
      proposedPrice: 45000,
      estimatedDuration: 90,
      notes: 'Incluye mano de obra, no incluye materiales',
      status: QuoteStatus.Pending,
      type: QuoteType.Detailed,
      createdAt: now,
      updatedAt: now,
    });

    expect(quote.id).toBe(id);
    expect(quote.orderId).toBe(orderId);
    expect(quote.providerId).toBe(providerId);
    expect(quote.proposedPrice).toBe(45000);
    expect(quote.estimatedDuration).toBe(90);
    expect(quote.status).toBe(QuoteStatus.Pending);
    expect(quote.type).toBe(QuoteType.Detailed);
  });

  it('is equal to another quote with the same id', () => {
    const id = QuoteId.create();
    const orderId = OrderId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const props = {
      orderId,
      providerId,
      proposedPrice: 1000,
      estimatedDuration: 30,
      notes: 'Notas',
      status: QuoteStatus.Pending,
      type: QuoteType.Standard,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Quote(id, props);
    const b = new Quote(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
