/**
 * Intent to search Credentials by a free-text term. Plain data — no behavior.
 */
export class SearchCredentialQuery {
  constructor(public readonly term: string) {}
}
