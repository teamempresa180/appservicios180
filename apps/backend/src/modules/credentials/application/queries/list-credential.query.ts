/**
 * Intent to list Credentials with pagination. Plain data — no behavior.
 */
export class ListCredentialQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
