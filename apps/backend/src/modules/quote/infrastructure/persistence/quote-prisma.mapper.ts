import { QuoteModel as PrismaQuote } from '@prisma/client';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * Translates between the `Quote` domain entity and its Prisma row
 * shape (`QuoteModel`, mapped to the `quotes` table). The only place
 * in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class QuotePrismaMapper {
  static toDomain(row: PrismaQuote): Quote {
    return new Quote(QuoteId.fromString(row.id), {
      orderId: OrderId.fromString(row.orderId),
      providerId: ProviderId.fromString(row.providerId),
      proposedPrice: row.proposedPrice,
      estimatedDuration: row.estimatedDuration,
      notes: row.notes,
      status: row.status as unknown as QuoteStatus,
      type: row.type as unknown as QuoteType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(quote: Quote): PrismaQuote {
    return {
      id: quote.id.value,
      orderId: quote.orderId.value,
      providerId: quote.providerId.value,
      proposedPrice: quote.proposedPrice,
      estimatedDuration: quote.estimatedDuration,
      notes: quote.notes,
      status: quote.status,
      type: quote.type,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
    };
  }
}
