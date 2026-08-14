import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { assertAssignedProvider } from '../authorization/order-access';
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
 *
 * Declaring the work finished is the assigned Provider's call alone
 * (or an Admin's) — checked before the status guard, same rationale
 * as `StartOrderUseCase`.
 */
export class CompleteOrderUseCase {
  private readonly logger = new Logger(CompleteOrderUseCase.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CompleteOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }
    await assertAssignedProvider(
      existing,
      command.caller,
      this.providerRepository,
      'complete',
    );
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
    this.logger.log(`Order completed (service finished) id=${completed.id.value}`);
    return OrderMapper.toDto(completed);
  }
}
