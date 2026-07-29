import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../../category/domain/value-objects/category-id.value-object';
import { Order } from '../../../domain/entities/order.entity';
import { OrderRepository } from '../../../domain/interfaces/order-repository.interface';
import { OrderId } from '../../../domain/value-objects/order-id.value-object';
import { OrderStatus } from '../../../domain/value-objects/order-status.value-object';

/** In-memory `OrderRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryOrderRepository implements OrderRepository {
  private readonly rows = new Map<string, Order>();

  findById(id: OrderId): Promise<Order | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Order[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  findByProviderId(providerId: ProviderId): Promise<Order[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId?.equals(providerId),
      ),
    );
  }

  findOpenByCategoryId(categoryId: CategoryId): Promise<Order[]> {
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.providerId === null &&
          row.status === OrderStatus.Pending &&
          row.categoryId.equals(categoryId),
      ),
    );
  }

  save(order: Order): Promise<void> {
    this.rows.set(order.id.value, order);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Order>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Order[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.title.toLowerCase().includes(lower) ||
          row.description.toLowerCase().includes(lower),
      ),
    );
  }
}
