/**
 * Intent to fetch a single Schedule block by id. Plain data — no behavior.
 */
export class GetScheduleQuery {
  constructor(public readonly id: string) {}
}
