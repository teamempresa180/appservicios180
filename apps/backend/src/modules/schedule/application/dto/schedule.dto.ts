import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ScheduleDto {
  id!: string;
  providerId!: string;
  startDateTime!: Date;
  endDateTime!: Date;
  status!: ScheduleStatus;
  type!: ScheduleType;
  createdAt!: Date;
  updatedAt!: Date;
}
