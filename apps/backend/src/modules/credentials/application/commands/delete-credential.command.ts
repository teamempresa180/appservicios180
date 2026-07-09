/**
 * Intent to delete an existing Credential record. Plain data — no behavior.
 */
export class DeleteCredentialCommand {
  constructor(public readonly id: string) {}
}
