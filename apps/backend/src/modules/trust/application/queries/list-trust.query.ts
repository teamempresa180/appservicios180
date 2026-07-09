/**
 * Intent to list Trust profiles with pagination. Plain data — no behavior.
 */
export class ListTrustQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
