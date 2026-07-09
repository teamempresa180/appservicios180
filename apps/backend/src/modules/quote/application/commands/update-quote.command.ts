/**
 * Intent to update an existing Quote. Plain data — no behavior.
 */
export class UpdateQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly proposedPrice?: number,
    public readonly estimatedDuration?: number,
    public readonly notes?: string,
  ) {}
}
