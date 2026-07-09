/**
 * Intent to accept an existing Quote. Plain data — no behavior.
 */
export class AcceptQuoteCommand {
  constructor(public readonly id: string) {}
}
