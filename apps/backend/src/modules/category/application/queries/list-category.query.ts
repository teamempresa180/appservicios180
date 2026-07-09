/**
 * Intent to list Categories with pagination. Plain data — no behavior.
 */
export class ListCategoryQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
