import { Caller } from '../../../core/application/caller';

/**
 * Intent to reject an existing Quote. Plain data — no behavior.
 * `caller` is who is asking: `RejectQuoteUseCase` only lets the
 * customer who requested the referenced Order, or an Admin, through.
 */
export class RejectQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
