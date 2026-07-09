import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * Intent to create a new Quote. Plain data — no behavior.
 */
export class CreateQuoteCommand {
  constructor(
    public readonly orderId: string,
    public readonly providerId: string,
    public readonly proposedPrice: number,
    public readonly estimatedDuration: number,
    public readonly notes: string,
    public readonly type: QuoteType,
  ) {}
}
