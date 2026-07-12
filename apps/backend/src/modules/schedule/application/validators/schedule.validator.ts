import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleCommand } from '../commands/create-schedule.command';
import { UpdateScheduleCommand } from '../commands/update-schedule.command';

/**
 * Structural validation for Schedule commands — required fields,
 * well-formed values. No uniqueness/overlap check — `findByProviderId`
 * returns `Schedule[]`, so multiple blocks per Provider are allowed;
 * nothing in the domain documents an overlap-prevention rule.
 */
export class ScheduleValidator {
  static validateCreate(command: CreateScheduleCommand): void {
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!Object.values(ScheduleType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(ScheduleType).join(', ')}`,
      );
    }
    if (
      !(command.startDateTime instanceof Date) ||
      Number.isNaN(command.startDateTime.getTime())
    ) {
      throw new ValidationException('startDateTime must be a valid date');
    }
    if (
      !(command.endDateTime instanceof Date) ||
      Number.isNaN(command.endDateTime.getTime())
    ) {
      throw new ValidationException('endDateTime must be a valid date');
    }
    if (command.startDateTime >= command.endDateTime) {
      throw new ValidationException('startDateTime must be before endDateTime');
    }
  }

  static validateUpdate(command: UpdateScheduleCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.startDateTime !== undefined &&
      (!(command.startDateTime instanceof Date) ||
        Number.isNaN(command.startDateTime.getTime()))
    ) {
      throw new ValidationException('startDateTime must be a valid date');
    }
    if (
      command.endDateTime !== undefined &&
      (!(command.endDateTime instanceof Date) ||
        Number.isNaN(command.endDateTime.getTime()))
    ) {
      throw new ValidationException('endDateTime must be a valid date');
    }
    if (
      command.startDateTime !== undefined &&
      command.endDateTime !== undefined &&
      command.startDateTime >= command.endDateTime
    ) {
      throw new ValidationException('startDateTime must be before endDateTime');
    }
    if (
      command.status !== undefined &&
      !Object.values(ScheduleStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(ScheduleStatus).join(', ')}`,
      );
    }
  }
}
