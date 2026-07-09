/**
 * Intent to search Quotes by a free-text term. Plain data — no behavior.
 */
export class SearchQuoteQuery {
  constructor(public readonly term: string) {}
}
