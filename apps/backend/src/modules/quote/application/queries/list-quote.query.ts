/**
 * Intent to list Quotes with pagination. Plain data — no behavior.
 */
export class ListQuoteQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
