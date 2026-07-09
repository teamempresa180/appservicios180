import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Intent to create a new Order. Plain data — no behavior.
 */
export class CreateOrderCommand {
  constructor(
    public readonly identityId: string,
    public readonly providerId: string,
    public readonly serviceId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly scheduledDate: Date,
    public readonly priority: OrderPriority,
  ) {}
}
