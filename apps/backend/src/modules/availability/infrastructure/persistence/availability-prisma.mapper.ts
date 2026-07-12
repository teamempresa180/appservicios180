import { AvailabilityModel as PrismaAvailability } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * Translates between the `Availability` domain entity and its Prisma
 * row shape (`AvailabilityModel`, mapped to the `availabilities`
 * table). The only place in this module that imports from
 * `@prisma/client` — Domain/Application never do.
 */
export class AvailabilityPrismaMapper {
  static toDomain(row: PrismaAvailability): Availability {
    return new Availability(AvailabilityId.fromString(row.id), {
      providerId: ProviderId.fromString(row.providerId),
      status: row.status as unknown as AvailabilityStatus,
      type: row.type as unknown as AvailabilityType,
      availableFrom: row.availableFrom,
      availableTo: row.availableTo,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(availability: Availability): PrismaAvailability {
    return {
      id: availability.id.value,
      providerId: availability.providerId.value,
      status: availability.status,
      type: availability.type,
      availableFrom: availability.availableFrom,
      availableTo: availability.availableTo,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
    };
  }
}
