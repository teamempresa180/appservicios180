import { Entity } from '../../../core/domain/base/entity.base';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ScheduleId } from '../value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../value-objects/schedule-status.value-object';
import { ScheduleType } from '../value-objects/schedule-type.value-object';

export interface ScheduleProps {
  providerId: ProviderId;
  startDateTime: Date;
  endDateTime: Date;
  status: ScheduleStatus;
  type: ScheduleType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a specific time block in a provider's agenda.
 * Pure data holder — no bookings, no orders, no external calendars, no
 * reminders, no recurrence logic, no persistence, no business rules.
 */
export class Schedule extends Entity<ScheduleId> {
  public readonly providerId: ProviderId;
  public readonly startDateTime: Date;
  public readonly endDateTime: Date;
  public readonly status: ScheduleStatus;
  public readonly type: ScheduleType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ScheduleId, props: ScheduleProps) {
    super(id);
    this.providerId = props.providerId;
    this.startDateTime = props.startDateTime;
    this.endDateTime = props.endDateTime;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
