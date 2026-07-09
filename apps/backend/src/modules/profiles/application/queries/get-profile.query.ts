/**
 * Intent to fetch a single Profile by id. Plain data — no behavior.
 */
export class GetProfileQuery {
  constructor(public readonly id: string) {}
}
