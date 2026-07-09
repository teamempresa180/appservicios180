import { OrderStatus } from '../../domain/value-objects/order-status.value-object';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Input shape for updating an Order. No validation.
 */
export class UpdateOrderDto {
  title?: string;
  description?: string;
  scheduledDate?: Date;
  status?: OrderStatus;
  priority?: OrderPriority;
}
