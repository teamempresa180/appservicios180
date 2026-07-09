/**
 * Intent to search Providers by a free-text term. Plain data — no behavior.
 */
export class SearchProviderQuery {
  constructor(public readonly term: string) {}
}
