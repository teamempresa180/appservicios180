import { Order } from '../../domain/entities/order.entity';
import { OrderDto } from '../dto/order.dto';

/**
 * Translates between the Order domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class OrderMapper {
  static toDto(order: Order): OrderDto {
    const dto = new OrderDto();
    dto.id = order.id.value;
    dto.identityId = order.identityId.value;
    dto.providerId = order.providerId?.value ?? null;
    dto.serviceId = order.serviceId?.value ?? null;
    dto.categoryId = order.categoryId.value;
    dto.title = order.title;
    dto.description = order.description;
    dto.scheduledDate = order.scheduledDate;
    dto.status = order.status;
    dto.priority = order.priority;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    return dto;
  }
}
