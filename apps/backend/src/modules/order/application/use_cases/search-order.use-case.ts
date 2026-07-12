import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { SearchOrderQuery } from '../queries/search-order.query';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/** Free-text search over `title`/`description`. */
export class SearchOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(query: SearchOrderQuery): Promise<OrderDto[]> {
    const results = await this.orderRepository.search(query.term);
    return results.map((order) => OrderMapper.toDto(order));
  }
}
