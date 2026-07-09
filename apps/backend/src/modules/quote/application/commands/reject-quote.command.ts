/**
 * Intent to reject an existing Quote. Plain data — no behavior.
 */
export class RejectQuoteCommand {
  constructor(public readonly id: string) {}
}
