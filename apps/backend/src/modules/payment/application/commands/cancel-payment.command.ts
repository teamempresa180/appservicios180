import { Caller } from '../../../core/application/caller';

/**
 * Intent to cancel an existing Payment. Plain data — no behavior.
 * `caller` is who is asking: `CancelPaymentUseCase` only lets the
 * original payer, or an Admin, cancel it.
 */
export class CancelPaymentCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
