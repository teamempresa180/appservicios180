/**
 * Intent to search Payments by a free-text term. Plain data — no behavior.
 */
export class SearchPaymentQuery {
  constructor(public readonly term: string) {}
}
