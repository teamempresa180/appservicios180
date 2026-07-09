/**
 * Intent to search Messages by a free-text term. Plain data — no behavior.
 */
export class SearchMessageQuery {
  constructor(public readonly term: string) {}
}
