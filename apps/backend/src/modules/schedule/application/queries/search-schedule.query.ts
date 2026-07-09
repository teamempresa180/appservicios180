/**
 * Intent to search Schedule blocks by a free-text term. Plain data — no behavior.
 */
export class SearchScheduleQuery {
  constructor(public readonly term: string) {}
}
