/**
 * Intent to delete an existing Address. Plain data — no behavior.
 */
export class DeleteAddressCommand {
  constructor(public readonly id: string) {}
}
