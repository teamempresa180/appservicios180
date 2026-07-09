/**
 * Intent to list Reviews with pagination. Plain data — no behavior.
 */
export class ListReviewQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
