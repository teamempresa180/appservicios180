import { Order } from '../entities/order.entity';
import { OrderId } from '../value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Order persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  findByIdentityId(identityId: IdentityId): Promise<Order[]>;
  findByProviderId(providerId: ProviderId): Promise<Order[]>;
  save(order: Order): Promise<void>;
}
