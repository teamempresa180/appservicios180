import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { assertCustomerOrAssignedProvider } from '../authorization/order-access';
import { CancelOrderCommand } from '../commands/cancel-order.command';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Cancels an existing Order by transitioning it to `Cancelled`
 * status. No prior-status guard — same criterion as
 * `UpdateProviderUseCase`, which applies changes unconditionally to
 * any found entity.
 *
 * Cancelling is restricted to the two parties actually bound by the
 * Order — the customer who requested it and the Provider assigned to
 * it — plus Admin. Any other authenticated caller gets
 * `ForbiddenException`. In particular a Provider browsing the open
 * requests in their category (`GET /orders/relevant-for-provider`)
 * is *not* a party to those Orders and cannot cancel them: an
 * unassigned Order has no Provider side at all, so "declining" one
 * was never this endpoint's meaning even though the mobile client
 * currently calls it that way.
 */
export class CancelOrderUseCase {
  private readonly logger = new Logger(CancelOrderUseCase.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CancelOrderCommand): Promise<OrderDto> {
    const id = OrderId.fromString(command.id);
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Order ${command.id} not found`);
    }
    await assertCustomerOrAssignedProvider(
      existing,
      command.caller,
      this.providerRepository,
      'cancel',
    );

    const cancelled = existing.with({
      status: OrderStatus.Cancelled,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(cancelled);
    this.logger.log(`Order cancelled id=${cancelled.id.value}`);
    return OrderMapper.toDto(cancelled);
  }
}
