import { Caller } from '../../../core/application/caller';

/**
 * Intent to mark an in-progress Order as completed. Plain data — no
 * behavior. `caller` is who is asking: `CompleteOrderUseCase` only
 * lets the Provider assigned to the Order, or an Admin, through.
 */
export class CompleteOrderCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
