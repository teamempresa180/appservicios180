import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class OrderDto {
  id!: string;
  identityId!: string;
  providerId!: string | null;
  serviceId!: string | null;
  categoryId!: string;
  title!: string;
  description!: string;
  scheduledDate!: Date;
  status!: OrderStatus;
  priority!: OrderPriority;
  createdAt!: Date;
  updatedAt!: Date;
}
