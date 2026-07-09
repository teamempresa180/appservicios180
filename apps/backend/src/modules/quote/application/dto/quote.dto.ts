import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class QuoteDto {
  id!: string;
  orderId!: string;
  providerId!: string;
  proposedPrice!: number;
  estimatedDuration!: number;
  notes!: string;
  status!: QuoteStatus;
  type!: QuoteType;
  createdAt!: Date;
  updatedAt!: Date;
}
