/**
 * Intent to list Providers with pagination. Plain data — no behavior.
 */
export class ListProviderQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
