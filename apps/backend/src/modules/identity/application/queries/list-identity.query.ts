/**
 * Intent to list Identities with pagination. Plain data — no behavior.
 */
export class ListIdentityQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
