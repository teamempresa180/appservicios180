/**
 * Intent to fetch a single Quote by id. Plain data — no behavior.
 */
export class GetQuoteQuery {
  constructor(public readonly id: string) {}
}
