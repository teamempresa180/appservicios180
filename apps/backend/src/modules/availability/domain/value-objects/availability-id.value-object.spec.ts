import { AvailabilityId } from './availability-id.value-object';

describe('AvailabilityId', () => {
  it('creates a new unique id', () => {
    const a = AvailabilityId.create();
    const b = AvailabilityId.create();
    expect(a.value).not.toBe(b.value);
  });

  it('wraps an existing string value', () => {
    const id = AvailabilityId.fromString('fixed-id');
    expect(id.value).toBe('fixed-id');
  });

  it('is equal by value', () => {
    const a = AvailabilityId.fromString('same-id');
    const b = AvailabilityId.fromString('same-id');
    expect(a.equals(b)).toBe(true);
  });
});
