/**
 * Intent to search Services by a free-text term. Plain data — no behavior.
 */
export class SearchServiceQuery {
  constructor(public readonly term: string) {}
}
