import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceCommand } from '../commands/create-service.command';
import { UpdateServiceCommand } from '../commands/update-service.command';

/**
 * Structural validation for Service commands — required fields,
 * well-formed values. No uniqueness-per-Provider/Category check —
 * `findByProviderId`/`findByCategoryId` return `Service[]`, so
 * multiple services per Provider/Category are allowed.
 */
export class ServiceValidator {
  static validateCreate(command: CreateServiceCommand): void {
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!command.categoryId?.trim()) {
      throw new ValidationException('categoryId is required');
    }
    if (!command.name?.trim()) {
      throw new ValidationException('name is required');
    }
    if (!command.description?.trim()) {
      throw new ValidationException('description is required');
    }
    if (
      typeof command.basePrice !== 'number' ||
      Number.isNaN(command.basePrice) ||
      command.basePrice < 0
    ) {
      throw new ValidationException('basePrice must be a non-negative number');
    }
    if (
      typeof command.estimatedDuration !== 'number' ||
      Number.isNaN(command.estimatedDuration) ||
      command.estimatedDuration < 0
    ) {
      throw new ValidationException(
        'estimatedDuration must be a non-negative number',
      );
    }
    if (!Object.values(ServiceType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(ServiceType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateServiceCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.basePrice !== undefined &&
      (typeof command.basePrice !== 'number' ||
        Number.isNaN(command.basePrice) ||
        command.basePrice < 0)
    ) {
      throw new ValidationException('basePrice must be a non-negative number');
    }
    if (
      command.estimatedDuration !== undefined &&
      (typeof command.estimatedDuration !== 'number' ||
        Number.isNaN(command.estimatedDuration) ||
        command.estimatedDuration < 0)
    ) {
      throw new ValidationException(
        'estimatedDuration must be a non-negative number',
      );
    }
    if (
      command.status !== undefined &&
      !Object.values(ServiceStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(ServiceStatus).join(', ')}`,
      );
    }
  }
}
