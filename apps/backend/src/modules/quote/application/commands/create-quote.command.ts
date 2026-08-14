import { Caller } from '../../../core/application/caller';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * Intent to create a new Quote. Plain data — no behavior. `caller` is
 * who is asking: `CreateQuoteUseCase` requires `providerId` to resolve
 * to a Provider record owned by that caller, so nobody can quote in
 * another Provider's name.
 */
export class CreateQuoteCommand {
  constructor(
    public readonly orderId: string,
    public readonly providerId: string,
    public readonly proposedPrice: number,
    public readonly estimatedDuration: number,
    public readonly notes: string,
    public readonly type: QuoteType,
    public readonly caller: Caller,
  ) {}
}
