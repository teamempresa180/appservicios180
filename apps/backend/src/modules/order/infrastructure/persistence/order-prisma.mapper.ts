import { OrderModel as PrismaOrder } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ServiceId } from '../../../service/domain/value-objects/service-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderId } from '../../domain/value-objects/order-id.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { OrderStatus } from '../../domain/value-objects/order-status.value-object';

/**
 * Translates between the `Order` domain entity and its Prisma row
 * shape (`OrderModel`, mapped to the `orders` table). The only place
 * in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class OrderPrismaMapper {
  static toDomain(row: PrismaOrder): Order {
    return new Order(OrderId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      providerId: row.providerId ? ProviderId.fromString(row.providerId) : null,
      serviceId: row.serviceId ? ServiceId.fromString(row.serviceId) : null,
      categoryId: CategoryId.fromString(row.categoryId),
      title: row.title,
      description: row.description,
      scheduledDate: row.scheduledDate,
      status: row.status as unknown as OrderStatus,
      priority: row.priority as unknown as OrderPriority,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(order: Order): PrismaOrder {
    return {
      id: order.id.value,
      identityId: order.identityId.value,
      providerId: order.providerId?.value ?? null,
      serviceId: order.serviceId?.value ?? null,
      categoryId: order.categoryId.value,
      title: order.title,
      description: order.description,
      scheduledDate: order.scheduledDate,
      status: order.status,
      priority: order.priority,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
