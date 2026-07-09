/**
 * Intent to search Verifications by a free-text term. Plain data — no behavior.
 */
export class SearchVerificationQuery {
  constructor(public readonly term: string) {}
}
