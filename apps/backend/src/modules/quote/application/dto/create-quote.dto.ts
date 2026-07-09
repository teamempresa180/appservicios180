import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * Input shape for creating a Quote. No validation.
 */
export class CreateQuoteDto {
  orderId!: string;
  providerId!: string;
  proposedPrice!: number;
  estimatedDuration!: number;
  notes!: string;
  type!: QuoteType;
}
