import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { CompleteOrderCommand } from '../commands/complete-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Marks an `InProgress` Order as `Completed` — the provider finished
 * the work. Guarded: only an `InProgress` Order can complete, same
 * rationale as `StartOrderUseCase`. This is the terminal, successful
 * state of the fulfillment flow (payment/review happen against a
 * `Completed` Order, but neither is triggered by this Use Case —
 * `Payment`/`Review` are their own bounded contexts).
 */
export class CompleteOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CompleteOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }
    if (existing.status !== OrderStatus.InProgress) {
      throw new BusinessRuleException(
        `Order ${command.id} must be InProgress before it can complete`,
      );
    }

    const completed = existing.with({
      status: OrderStatus.Completed,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(completed);
    return OrderMapper.toDto(completed);
  }
}
