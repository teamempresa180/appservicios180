/**
 * Intent to cancel an existing Order. Plain data — no behavior.
 */
export class CancelOrderCommand {
  constructor(public readonly id: string) {}
}
