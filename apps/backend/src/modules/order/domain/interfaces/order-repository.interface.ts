import { PaginatedResult } from '../../../core/application/paginated-result';
import { TransactionContext } from '../../../core/domain/ports/transaction-context';
import { Order } from '../entities/order.entity';
import { OrderId } from '../value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';

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
  /** Pending, unassigned (`providerId IS NULL`) open requests in a
   *  given Category — what a compatible Provider's dashboard shows
   *  alongside their own `findByProviderId` orders. */
  findOpenByCategoryId(categoryId: CategoryId): Promise<Order[]>;
  /** `tx`, when provided (see `TransactionRunner`), scopes this write
   *  to an in-flight transaction instead of the default connection —
   *  used by `AcceptQuoteUseCase` so the Order and Quote transitions
   *  commit or roll back together. */
  save(order: Order, tx?: TransactionContext): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Order>>;
  /** Free-text match against `title`/`description`. */
  search(term: string): Promise<Order[]>;
}
