/**
 * Intent to list Verifications with pagination. Plain data — no behavior.
 */
export class ListVerificationQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
