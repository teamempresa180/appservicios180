/**
 * Intent to delete an existing Service. Plain data — no behavior.
 */
export class DeleteServiceCommand {
  constructor(public readonly id: string) {}
}
