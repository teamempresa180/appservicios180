/**
 * Intent to list Availabilities with pagination. Plain data — no behavior.
 */
export class ListAvailabilityQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
