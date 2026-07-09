/**
 * Intent to search Authentication methods by a free-text term. Plain data — no behavior.
 */
export class SearchAuthenticationQuery {
  constructor(public readonly term: string) {}
}
