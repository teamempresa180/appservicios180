/**
 * Intent to mark an in-progress Order as completed. Plain data — no
 * behavior.
 */
export class CompleteOrderCommand {
  constructor(public readonly id: string) {}
}
