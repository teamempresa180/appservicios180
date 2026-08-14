import { Caller } from '../../../core/application/caller';

/**
 * Intent to search Quotes by a free-text term. Plain data — no
 * behavior. `caller` is who is asking: `SearchQuoteUseCase` drops
 * every match that caller is not a party to.
 */
export class SearchQuoteQuery {
  constructor(
    public readonly term: string,
    public readonly caller: Caller,
  ) {}
}
