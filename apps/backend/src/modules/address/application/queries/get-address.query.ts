/**
 * Intent to fetch a single Address by id. Plain data — no behavior.
 */
export class GetAddressQuery {
  constructor(public readonly id: string) {}
}
