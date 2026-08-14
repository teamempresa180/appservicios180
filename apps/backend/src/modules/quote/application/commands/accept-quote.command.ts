import { Caller } from '../../../core/application/caller';

/**
 * Intent to accept an existing Quote. Plain data — no behavior.
 * `caller` is who is asking: `AcceptQuoteUseCase` only lets the
 * customer who requested the referenced Order, or an Admin, through.
 */
export class AcceptQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
