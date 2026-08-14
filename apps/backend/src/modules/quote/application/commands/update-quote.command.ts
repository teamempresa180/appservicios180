import { Caller } from '../../../core/application/caller';

/**
 * Intent to update an existing Quote. Plain data — no behavior.
 * `caller` is who is asking: `UpdateQuoteUseCase` only lets the
 * Provider that submitted the Quote, or an Admin, revise it.
 */
export class UpdateQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
    public readonly proposedPrice?: number,
    public readonly estimatedDuration?: number,
    public readonly notes?: string,
  ) {}
}
