import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Order } from '../../domain/entities/order.entity';
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
  private readonly logger = new Logger(CancelOrderUseCase.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CancelOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }

    const cancelled = new Order(existing.id, {
      identityId: existing.identityId,
      providerId: existing.providerId,
      serviceId: existing.serviceId,
      categoryId: existing.categoryId,
      title: existing.title,
      description: existing.description,
      scheduledDate: existing.scheduledDate,
      status: OrderStatus.Cancelled,
      priority: existing.priority,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(cancelled);
    this.logger.log(`Order cancelled id=${cancelled.id.value}`);
    return OrderMapper.toDto(cancelled);
  }
}
