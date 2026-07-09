import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { CancelOrderCommand } from '../commands/cancel-order.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(command: CancelOrderCommand): Promise<OrderDto> {
    void this.orderRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
