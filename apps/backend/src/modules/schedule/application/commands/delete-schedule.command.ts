/**
 * Intent to delete an existing Schedule block. Plain data — no behavior.
 */
export class DeleteScheduleCommand {
  constructor(public readonly id: string) {}
}
