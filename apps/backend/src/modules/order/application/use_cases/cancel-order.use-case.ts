import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { CancelOrderCommand } from '../commands/cancel-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Cancels an existing Order by transitioning it to `Cancelled`
 * status. No prior-status guard — same criterion as
 * `UpdateProviderUseCase`, which applies changes unconditionally to
 * any found entity.
 */
export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CancelOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }

    const cancelled = existing.with({
      status: OrderStatus.Cancelled,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(cancelled);
    return OrderMapper.toDto(cancelled);
  }
}
