/**
 * Intent to list Schedule blocks with pagination. Plain data — no behavior.
 */
export class ListScheduleQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
