import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Intent to create a new Order. Plain data — no behavior.
 * `categoryId` is always required (what kind of service is being
 * requested). `providerId`/`serviceId` are either both present — a
 * **direct hire**, the client picked a specific provider's specific
 * listed service — or both absent — an **open request**, any
 * compatible provider in `categoryId` may submit a Quote; see
 * `OrderValidator.validateCreate`.
 */
export class CreateOrderCommand {
  constructor(
    public readonly identityId: string,
    public readonly categoryId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly scheduledDate: Date,
    public readonly priority: OrderPriority,
    public readonly providerId?: string,
    public readonly serviceId?: string,
  ) {}
}
