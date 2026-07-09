/**
 * Intent to search Reviews by a free-text term. Plain data — no behavior.
 */
export class SearchReviewQuery {
  constructor(public readonly term: string) {}
}
