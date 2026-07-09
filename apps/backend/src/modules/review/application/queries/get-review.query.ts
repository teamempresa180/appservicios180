/**
 * Intent to fetch a single Review by id. Plain data — no behavior.
 */
export class GetReviewQuery {
  constructor(public readonly id: string) {}
}
