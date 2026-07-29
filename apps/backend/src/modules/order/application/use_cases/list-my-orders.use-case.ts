import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Lists every Order belonging to a client Identity (`GET /orders/mine`,
 * client-facing). Closes a real scoping bug: the generic `GET /orders`
 * list returns every Order in the system with no `identityId` filter,
 * even though `OrderRepository.findByIdentityId` has existed since
 * the Order module's Infrastructure layer was built — this Use Case
 * is the first thing to actually call it from an HTTP-reachable path.
 */
export class ListMyOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(identityId: string): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findByIdentityId(
      IdentityId.fromString(identityId),
    );
    return orders
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((order) => OrderMapper.toDto(order));
  }
}
