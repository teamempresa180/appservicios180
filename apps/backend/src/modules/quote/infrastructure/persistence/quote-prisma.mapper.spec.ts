import { QuoteModel as PrismaQuote } from '@prisma/client';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { QuotePrismaMapper } from './quote-prisma.mapper';

describe('QuotePrismaMapper', () => {
  const row: PrismaQuote = {
    id: 'id-1',
    orderId: 'order-1',
    providerId: 'provider-1',
    proposedPrice: 100,
    estimatedDuration: 120,
    notes: 'Includes parts and labor',
    status: 'PENDING',
    type: 'STANDARD',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const quote = QuotePrismaMapper.toDomain(row);

    expect(quote.id.value).toBe('id-1');
    expect(quote.orderId.value).toBe('order-1');
    expect(quote.providerId.value).toBe('provider-1');
    expect(quote.status).toBe(QuoteStatus.Pending);
    expect(quote.type).toBe(QuoteType.Standard);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const quote = new Quote(QuoteId.fromString('id-1'), {
      orderId: OrderId.fromString('order-1'),
      providerId: ProviderId.fromString('provider-1'),
      proposedPrice: 100,
      estimatedDuration: 120,
      notes: 'Includes parts and labor',
      status: QuoteStatus.Pending,
      type: QuoteType.Standard,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(QuotePrismaMapper.toPersistence(quote)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const quote = QuotePrismaMapper.toDomain(row);
    expect(QuotePrismaMapper.toPersistence(quote)).toEqual(row);
  });
});
