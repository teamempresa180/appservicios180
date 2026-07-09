/**
 * Intent to search Identities by a free-text term. Plain data — no behavior.
 */
export class SearchIdentityQuery {
  constructor(public readonly term: string) {}
}
