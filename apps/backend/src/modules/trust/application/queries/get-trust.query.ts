/**
 * Intent to fetch a single Trust profile by id. Plain data — no behavior.
 */
export class GetTrustQuery {
  constructor(public readonly id: string) {}
}
