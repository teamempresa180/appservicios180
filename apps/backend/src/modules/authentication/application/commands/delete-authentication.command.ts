/**
 * Intent to delete an existing Authentication method. Plain data — no behavior.
 */
export class DeleteAuthenticationCommand {
  constructor(public readonly id: string) {}
}
