import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderValidator } from '../validators/order.validator';

/**
 * Updates the mutable fields of an existing Order (`title`,
 * `description`, `scheduledDate`, `priority`) — `identityId`/
 * `providerId`/`serviceId`/`categoryId`/`status` are not offered by
 * `UpdateOrderCommand`; status changes go exclusively through
 * `CancelOrderUseCase`/`StartOrderUseCase`/`CompleteOrderUseCase`
 * (and, for `Pending` → `Accepted` on an open request, through
 * `AcceptQuoteUseCase` assigning a Provider).
 */
export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: UpdateOrderCommand): Promise<OrderDto> {
    OrderValidator.validateUpdate(command);

    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }

    const updated = existing.with({
      title: command.title ?? existing.title,
      description: command.description ?? existing.description,
      scheduledDate: command.scheduledDate ?? existing.scheduledDate,
      priority: command.priority ?? existing.priority,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(updated);
    return OrderMapper.toDto(updated);
  }
}
