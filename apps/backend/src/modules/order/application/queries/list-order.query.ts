/**
 * Intent to list Orders with pagination. Plain data — no behavior.
 */
export class ListOrderQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
