import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';

/**
 * Input shape for updating a Schedule block. No validation.
 */
export class UpdateScheduleDto {
  startDateTime?: Date;
  endDateTime?: Date;
  status?: ScheduleStatus;
}
