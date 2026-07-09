/**
 * Intent to list Profiles with pagination. Plain data — no behavior.
 */
export class ListProfileQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
