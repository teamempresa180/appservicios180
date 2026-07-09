/**
 * Intent to fetch a single Service by id. Plain data — no behavior.
 */
export class GetServiceQuery {
  constructor(public readonly id: string) {}
}
