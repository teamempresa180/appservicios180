import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';

/**
 * Intent to update an existing Schedule block. Plain data — no behavior.
 */
export class UpdateScheduleCommand {
  constructor(
    public readonly id: string,
    public readonly startDateTime?: Date,
    public readonly endDateTime?: Date,
    public readonly status?: ScheduleStatus,
  ) {}
}
