import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';

/**
 * Input shape for creating an Order. No validation.
 */
export class CreateOrderDto {
  identityId!: string;
  providerId!: string;
  serviceId!: string;
  title!: string;
  description!: string;
  scheduledDate!: Date;
  priority!: OrderPriority;
}
