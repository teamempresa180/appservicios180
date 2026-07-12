import { PaginatedResult } from '../../../core/application/paginated-result';
import { Order } from '../entities/order.entity';
import { OrderId } from '../value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Order persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 8: `PrismaOrderRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `OrderRepository` implementation by contract
 *  instead of by concrete class. */
export const ORDER_REPOSITORY = Symbol('OrderRepository');

export interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByIdentityId(identityId: IdentityId): Promise<Order[]>;
  findByProviderId(providerId: ProviderId): Promise<Order[]>;
  save(order: Order): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Order>>;
  /** Free-text match against `title`/`description`. */
  search(term: string): Promise<Order[]>;
}
