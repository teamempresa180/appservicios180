import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * Intent to create a new Schedule block. Plain data — no behavior.
 */
export class CreateScheduleCommand {
  constructor(
    public readonly providerId: string,
    public readonly startDateTime: Date,
    public readonly endDateTime: Date,
    public readonly type: ScheduleType,
  ) {}
}
