/**
 * Intent to fetch a single Credential by id. Plain data — no behavior.
 */
export class GetCredentialQuery {
  constructor(public readonly id: string) {}
}
