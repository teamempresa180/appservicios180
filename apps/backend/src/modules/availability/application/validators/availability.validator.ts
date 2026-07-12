import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityCommand } from '../commands/create-availability.command';
import { UpdateAvailabilityCommand } from '../commands/update-availability.command';

/**
 * Structural validation for Availability commands — required fields,
 * well-formed values. No uniqueness-per-Provider check —
 * `findByProviderId` returns `Availability[]`, so multiple
 * availabilities per Provider are allowed.
 */
export class AvailabilityValidator {
  static validateCreate(command: CreateAvailabilityCommand): void {
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!Object.values(AvailabilityType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(AvailabilityType).join(', ')}`,
      );
    }
    if (
      !(command.availableFrom instanceof Date) ||
      Number.isNaN(command.availableFrom.getTime())
    ) {
      throw new ValidationException('availableFrom must be a valid date');
    }
    if (
      !(command.availableTo instanceof Date) ||
      Number.isNaN(command.availableTo.getTime())
    ) {
      throw new ValidationException('availableTo must be a valid date');
    }
    if (command.availableFrom >= command.availableTo) {
      throw new ValidationException('availableFrom must be before availableTo');
    }
  }

  static validateUpdate(command: UpdateAvailabilityCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.availableFrom !== undefined &&
      (!(command.availableFrom instanceof Date) ||
        Number.isNaN(command.availableFrom.getTime()))
    ) {
      throw new ValidationException('availableFrom must be a valid date');
    }
    if (
      command.availableTo !== undefined &&
      (!(command.availableTo instanceof Date) ||
        Number.isNaN(command.availableTo.getTime()))
    ) {
      throw new ValidationException('availableTo must be a valid date');
    }
    if (
      command.availableFrom !== undefined &&
      command.availableTo !== undefined &&
      command.availableFrom >= command.availableTo
    ) {
      throw new ValidationException('availableFrom must be before availableTo');
    }
    if (
      command.status !== undefined &&
      !Object.values(AvailabilityStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(AvailabilityStatus).join(', ')}`,
      );
    }
  }
}
