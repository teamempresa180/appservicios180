import { Availability } from './availability.entity';
import { AvailabilityId } from '../value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../value-objects/availability-status.value-object';
import { AvailabilityType } from '../value-objects/availability-type.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

describe('Availability', () => {
  it('holds all the assigned properties', () => {
    const id = AvailabilityId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const availability = new Availability(id, {
      providerId,
      status: AvailabilityStatus.Active,
      type: AvailabilityType.FullTime,
      availableFrom: new Date('2026-01-01'),
      availableTo: new Date('2026-12-31'),
      createdAt: now,
      updatedAt: now,
    });

    expect(availability.id).toBe(id);
    expect(availability.providerId).toBe(providerId);
    expect(availability.status).toBe(AvailabilityStatus.Active);
    expect(availability.type).toBe(AvailabilityType.FullTime);
  });

  it('is equal to another availability with the same id', () => {
    const id = AvailabilityId.create();
    const providerId = ProviderId.create();
    const now = new Date();
    const props = {
      providerId,
      status: AvailabilityStatus.Active,
      type: AvailabilityType.PartTime,
      availableFrom: now,
      availableTo: now,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Availability(id, props);
    const b = new Availability(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
