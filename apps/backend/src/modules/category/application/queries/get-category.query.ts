/**
 * Intent to fetch a single Category by id. Plain data — no behavior.
 */
export class GetCategoryQuery {
  constructor(public readonly id: string) {}
}
