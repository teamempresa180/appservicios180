import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * Input shape for creating a Schedule block. No validation.
 */
export class CreateScheduleDto {
  providerId!: string;
  startDateTime!: Date;
  endDateTime!: Date;
  type!: ScheduleType;
}
