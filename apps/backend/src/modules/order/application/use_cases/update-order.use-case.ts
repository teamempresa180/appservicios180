import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { UpdateOrderCommand } from '../commands/update-order.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(command: UpdateOrderCommand): Promise<OrderDto> {
    void this.orderRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
