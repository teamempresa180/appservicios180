import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { GetOrderQuery } from '../queries/get-order.query';

/**
 * Fetches a single Order by id, returning `null` when not found —
 * matches the `Promise<OrderDto | null>` signature already declared
 * for this use case.
 */
export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(query: GetOrderQuery): Promise<OrderDto | null> {
    const order = await this.orderRepository.findById(
      OrderId.fromString(query.id),
    );
    return order ? OrderMapper.toDto(order) : null;
  }
}
