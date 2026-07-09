/**
 * Intent to search Categories by a free-text term. Plain data — no behavior.
 */
export class SearchCategoryQuery {
  constructor(public readonly term: string) {}
}
