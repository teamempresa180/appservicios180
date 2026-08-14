import { Caller } from '../../../core/application/caller';

/**
 * Intent to cancel an existing Order. Plain data — no behavior.
 * `caller` is who is asking: `CancelOrderUseCase` only lets the
 * customer who requested the Order, its assigned Provider, or an
 * Admin through.
 */
export class CancelOrderCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
