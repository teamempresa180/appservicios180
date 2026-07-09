/**
 * Intent to fetch a single Provider by id. Plain data — no behavior.
 */
export class GetProviderQuery {
  constructor(public readonly id: string) {}
}
