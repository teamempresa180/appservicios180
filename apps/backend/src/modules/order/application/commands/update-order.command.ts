import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Intent to update an existing Order. Plain data — no behavior.
 */
export class UpdateOrderCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly scheduledDate?: Date,
    public readonly priority?: OrderPriority,
  ) {}
}
