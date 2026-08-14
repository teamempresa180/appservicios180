import { Caller } from '../../../core/application/caller';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Intent to update an existing Order. Plain data — no behavior.
 * `caller` is who is asking: `UpdateOrderUseCase` only lets the
 * customer who requested the Order, or an Admin, edit it — the
 * assigned Provider does not get to rewrite the client's request.
 */
export class UpdateOrderCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
    public readonly title?: string,
    public readonly description?: string,
    public readonly scheduledDate?: Date,
    public readonly priority?: OrderPriority,
  ) {}
}
