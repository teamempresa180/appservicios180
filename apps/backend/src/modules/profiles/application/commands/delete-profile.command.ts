/**
 * Intent to delete an existing Profile. Plain data — no behavior.
 */
export class DeleteProfileCommand {
  constructor(public readonly id: string) {}
}
