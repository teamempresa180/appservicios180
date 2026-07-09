/**
 * Intent to search Orders by a free-text term. Plain data — no behavior.
 */
export class SearchOrderQuery {
  constructor(public readonly term: string) {}
}
