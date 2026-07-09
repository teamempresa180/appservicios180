/**
 * Intent to search Trust profiles by a free-text term. Plain data — no behavior.
 */
export class SearchTrustQuery {
  constructor(public readonly term: string) {}
}
