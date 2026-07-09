/**
 * Intent to search Profiles by a free-text term. Plain data — no behavior.
 */
export class SearchProfileQuery {
  constructor(public readonly term: string) {}
}
