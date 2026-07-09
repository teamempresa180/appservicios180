/**
 * Intent to delete an existing Contact. Plain data — no behavior.
 */
export class DeleteContactCommand {
  constructor(public readonly id: string) {}
}
