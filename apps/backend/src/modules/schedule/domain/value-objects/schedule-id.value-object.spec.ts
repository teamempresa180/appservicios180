import { ScheduleId } from './schedule-id.value-object';

describe('ScheduleId', () => {
  it('creates a new unique id', () => {
    const a = ScheduleId.create();
    const b = ScheduleId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = ScheduleId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = ScheduleId.fromString('same-id');
    const b = ScheduleId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
