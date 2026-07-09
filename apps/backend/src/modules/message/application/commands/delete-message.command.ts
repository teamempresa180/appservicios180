/**
 * Intent to delete an existing Message. Plain data — no behavior.
 */
export class DeleteMessageCommand {
  constructor(public readonly id: string) {}
}
