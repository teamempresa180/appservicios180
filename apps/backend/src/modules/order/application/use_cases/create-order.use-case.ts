import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { CreateOrderCommand } from '../commands/create-order.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(command: CreateOrderCommand): Promise<OrderDto> {
    void this.orderRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
