/**
 * Intent to fetch a single Identity by id. Plain data — no behavior.
 */
export class GetIdentityQuery {
  constructor(public readonly id: string) {}
}
