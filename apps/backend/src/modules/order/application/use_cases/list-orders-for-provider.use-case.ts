import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/interfaces/order-repository.interface';
import { OrderDto } from '../dto/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

/**
 * Lists every Order "relevant" to the calling Provider
 * (`GET /orders/relevant-for-provider`, provider-facing): Orders
 * already directly hired to them (any status — this doubles as their
 * order history), plus every still-`Pending`, unassigned open request
 * in their own Category (`Provider.categoryId`, added alongside the
 * open-request model) that they're free to submit a Quote for.
 *
 * Closes a real correctness bug, not just a missing filter: before
 * this Use Case, the provider dashboard called the generic
 * `GET /orders` with no scoping at all — a plumber's dashboard showed
 * every pending order from every category, not just plumbing
 * requests. Resolves the calling Identity to its Provider record
 * first (`ProviderRepository.findByIdentityId`) since `@CurrentUser()`
 * only carries the Identity id, not the Provider id — returns an
 * empty list for an Identity with no Provider record (a Customer
 * calling this by mistake sees nothing, not an error).
 */
export class ListOrdersForProviderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(identityId: string): Promise<OrderDto[]> {
    const provider = await this.providerRepository.findByIdentityId(
      IdentityId.fromString(identityId),
    );
    if (!provider) {
      return [];
    }

    const [direct, open] = await Promise.all([
      this.orderRepository.findByProviderId(provider.id),
      provider.categoryId
        ? this.orderRepository.findOpenByCategoryId(provider.categoryId)
        : Promise.resolve<Order[]>([]),
    ]);

    const byId = new Map<string, Order>();
    for (const order of [...direct, ...open]) {
      byId.set(order.id.value, order);
    }

    return [...byId.values()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((order) => OrderMapper.toDto(order));
  }
}
