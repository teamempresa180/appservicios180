import { AvailabilityModel as PrismaAvailability } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityPrismaMapper } from './availability-prisma.mapper';

describe('AvailabilityPrismaMapper', () => {
  const row: PrismaAvailability = {
    id: 'id-1',
    providerId: 'provider-1',
    status: 'ACTIVE',
    type: 'FULL_TIME',
    availableFrom: new Date('2026-01-01T08:00:00Z'),
    availableTo: new Date('2026-01-01T17:00:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const availability = AvailabilityPrismaMapper.toDomain(row);

    expect(availability.id.value).toBe('id-1');
    expect(availability.providerId.value).toBe('provider-1');
    expect(availability.status).toBe(AvailabilityStatus.Active);
    expect(availability.type).toBe(AvailabilityType.FullTime);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const availability = new Availability(AvailabilityId.fromString('id-1'), {
      providerId: ProviderId.fromString('provider-1'),
      status: AvailabilityStatus.Active,
      type: AvailabilityType.FullTime,
      availableFrom: new Date('2026-01-01T08:00:00Z'),
      availableTo: new Date('2026-01-01T17:00:00Z'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(AvailabilityPrismaMapper.toPersistence(availability)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const availability = AvailabilityPrismaMapper.toDomain(row);
    expect(AvailabilityPrismaMapper.toPersistence(availability)).toEqual(row);
  });
});
