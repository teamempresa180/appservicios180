/**
 * Intent to search Availabilities by a free-text term. Plain data — no behavior.
 */
export class SearchAvailabilityQuery {
  constructor(public readonly term: string) {}
}
