import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { GetOrderQuery } from '../queries/get-order.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(query: GetOrderQuery): Promise<OrderDto | null> {
    void this.orderRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
