/**
 * Intent to search Addresses by a free-text term. Plain data — no behavior.
 */
export class SearchAddressQuery {
  constructor(public readonly term: string) {}
}
