import { PaginatedResult } from '../../../core/application/paginated-result';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { ListOrderQuery } from '../queries/list-order.query';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/** Lists Orders page by page. */
export class ListOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(query: ListOrderQuery): Promise<PaginatedResult<OrderDto>> {
    const result = await this.orderRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((order) => OrderMapper.toDto(order)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
