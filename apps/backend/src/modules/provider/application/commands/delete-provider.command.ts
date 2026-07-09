/**
 * Intent to delete an existing Provider. Plain data — no behavior.
 */
export class DeleteProviderCommand {
  constructor(public readonly id: string) {}
}
