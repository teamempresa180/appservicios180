/**
 * Intent to fetch a single Verification by id. Plain data — no behavior.
 */
export class GetVerificationQuery {
  constructor(public readonly id: string) {}
}
