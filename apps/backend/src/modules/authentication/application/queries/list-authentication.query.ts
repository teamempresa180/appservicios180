/**
 * Intent to list Authentication methods with pagination. Plain data — no behavior.
 */
export class ListAuthenticationQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
