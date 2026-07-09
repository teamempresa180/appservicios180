/**
 * Intent to cancel an existing Payment. Plain data — no behavior.
 */
export class CancelPaymentCommand {
  constructor(public readonly id: string) {}
}
