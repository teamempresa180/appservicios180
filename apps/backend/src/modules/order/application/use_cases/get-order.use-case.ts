import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { assertCustomerOrAssignedProvider } from '../authorization/order-access';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';
import { GetOrderQuery } from '../queries/get-order.query';

/**
 * Fetches a single Order by id, returning `null` when not found —
 * matches the `Promise<OrderDto | null>` signature already declared
 * for this use case.
 *
 * An Order is only readable by the two parties bound to it (the
 * customer who requested it and its assigned Provider) or an Admin;
 * anyone else gets `ForbiddenException`. Deliberately a 403 rather
 * than the `null` → 404 path: the Order does exist, and collapsing
 * "not yours" into "not found" would make the two indistinguishable
 * for a caller who already holds a valid id (which is how the mobile
 * client reaches this endpoint — from a chat or an order card it was
 * legitimately shown).
 */
export class GetOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderDto | null> {
    const order = await this.orderRepository.findById(
      OrderId.fromString(query.id),
    );
    if (!order) {
      return null;
    }
    await assertCustomerOrAssignedProvider(
      order,
      query.caller,
      this.providerRepository,
      'read',
    );
    return OrderMapper.toDto(order);
  }
}
