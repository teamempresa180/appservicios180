import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { CreateOrderCommand } from '../commands/create-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';

/**
 * Structural validation for Order commands — required fields,
 * well-formed values. No uniqueness check — `findByIdentityId`/
 * `findByProviderId` return `Order[]`, so multiple orders per
 * Identity/Provider are allowed.
 */
export class OrderValidator {
  static validateCreate(command: CreateOrderCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!command.serviceId?.trim()) {
      throw new ValidationException('serviceId is required');
    }
    if (!command.title?.trim()) {
      throw new ValidationException('title is required');
    }
    if (!command.description?.trim()) {
      throw new ValidationException('description is required');
    }
    if (
      !(command.scheduledDate instanceof Date) ||
      Number.isNaN(command.scheduledDate.getTime())
    ) {
      throw new ValidationException('scheduledDate must be a valid date');
    }
    if (!Object.values(OrderPriority).includes(command.priority)) {
      throw new ValidationException(
        `priority must be one of: ${Object.values(OrderPriority).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateOrderCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.title !== undefined && !command.title.trim()) {
      throw new ValidationException('title cannot be blank');
    }
    if (command.description !== undefined && !command.description.trim()) {
      throw new ValidationException('description cannot be blank');
    }
    if (
      command.scheduledDate !== undefined &&
      (!(command.scheduledDate instanceof Date) ||
        Number.isNaN(command.scheduledDate.getTime()))
    ) {
      throw new ValidationException('scheduledDate must be a valid date');
    }
    if (
      command.priority !== undefined &&
      !Object.values(OrderPriority).includes(command.priority)
    ) {
      throw new ValidationException(
        `priority must be one of: ${Object.values(OrderPriority).join(', ')}`,
      );
    }
  }
}
