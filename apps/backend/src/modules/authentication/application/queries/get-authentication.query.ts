/**
 * Intent to fetch a single Authentication method by id. Plain data — no behavior.
 */
export class GetAuthenticationQuery {
  constructor(public readonly id: string) {}
}
