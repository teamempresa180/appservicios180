import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { StartOrderCommand } from '../commands/start-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Marks an `Accepted` Order as `InProgress` — the provider has begun
 * the work. Unlike `CancelOrderUseCase` (no prior-status guard, by
 * design — cancelling is always allowed), this transition *is*
 * guarded: only an `Accepted` Order can start, since `InProgress`
 * without a prior client acceptance would skip the quote-acceptance
 * step this status machine depends on (see `AcceptQuoteUseCase`).
 */
export class StartOrderUseCase {
  private readonly logger = new Logger(StartOrderUseCase.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: StartOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }
    if (existing.status !== OrderStatus.Accepted) {
      throw new BusinessRuleException(
        `Order ${command.id} must be Accepted before it can start`,
      );
    }

    const started = existing.with({
      status: OrderStatus.InProgress,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(started);
    this.logger.log(`Order started (InProgress) id=${started.id.value}`);
    return OrderMapper.toDto(started);
  }
}
