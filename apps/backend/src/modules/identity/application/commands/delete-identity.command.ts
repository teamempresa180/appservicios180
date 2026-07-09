/**
 * Intent to delete an existing Identity. Plain data — no behavior.
 */
export class DeleteIdentityCommand {
  constructor(public readonly id: string) {}
}
