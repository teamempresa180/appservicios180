/**
 * Intent to search Contacts by a free-text term. Plain data — no behavior.
 */
export class SearchContactQuery {
  constructor(public readonly term: string) {}
}
