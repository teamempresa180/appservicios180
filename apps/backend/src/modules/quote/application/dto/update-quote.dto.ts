import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';

/**
 * Input shape for updating a Quote. No validation.
 */
export class UpdateQuoteDto {
  proposedPrice?: number;
  estimatedDuration?: number;
  notes?: string;
  status?: QuoteStatus;
}
