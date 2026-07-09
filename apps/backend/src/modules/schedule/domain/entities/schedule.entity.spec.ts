import { Schedule } from './schedule.entity';
import { ScheduleId } from '../value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../value-objects/schedule-status.value-object';
import { ScheduleType } from '../value-objects/schedule-type.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('Schedule', () => {
  it('holds all the assigned properties', () => {
    const id = ScheduleId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const schedule = new Schedule(id, {
      providerId,
      startDateTime: new Date('2026-02-01T08:00:00'),
      endDateTime: new Date('2026-02-01T10:00:00'),
      status: ScheduleStatus.Open,
      type: ScheduleType.Regular,
      createdAt: now,
      updatedAt: now,
    });

    expect(schedule.id).toBe(id);
    expect(schedule.providerId).toBe(providerId);
    expect(schedule.status).toBe(ScheduleStatus.Open);
    expect(schedule.type).toBe(ScheduleType.Regular);
  });

  it('is equal to another schedule with the same id', () => {
    const id = ScheduleId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const props = {
      providerId,
      startDateTime: now,
      endDateTime: now,
      status: ScheduleStatus.Open,
      type: ScheduleType.Blocked,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Schedule(id, props);
    const b = new Schedule(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
