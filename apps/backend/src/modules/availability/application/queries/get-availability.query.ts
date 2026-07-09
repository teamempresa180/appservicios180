/**
 * Intent to fetch a single Availability by id. Plain data — no behavior.
 */
export class GetAvailabilityQuery {
  constructor(public readonly id: string) {}
}
