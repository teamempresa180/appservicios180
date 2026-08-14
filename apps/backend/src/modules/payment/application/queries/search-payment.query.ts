import { Caller } from '../../../core/application/caller';

/**
 * Intent to search Payments by a free-text term. Plain data — no
 * behavior. `caller` is who is asking: `SearchPaymentUseCase` drops
 * every match that caller neither paid nor received.
 */
export class SearchPaymentQuery {
  constructor(
    public readonly term: string,
    public readonly caller: Caller,
  ) {}
}
