import { PrismaClient } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { PrismaAvailabilityRepository } from './prisma-availability.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaAvailabilityRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaAvailabilityRepository(prisma as never);
  let providerId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-availability-it-${Date.now()}`,
        fullName: 'Availability Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-AVAILABILITY-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-availability-it-${Date.now()}`,
        identityId: identity.id,
        displayName: 'Availability Integration Owner',
        avatarUrl: null,
        bio: null,
        visibility: 'PUBLIC',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const provider = await prisma.providerModel.create({
      data: {
        id: `provider-for-availability-it-${Date.now()}`,
        identityId: identity.id,
        providerProfileId: profile.id,
        status: 'ACTIVE',
        type: 'INDEPENDENT',
        experience: 'INTERMEDIATE',
        biography: 'bio',
        yearsOfExperience: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    providerId = provider.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildAvailability() {
    const now = new Date();
    return new Availability(AvailabilityId.create(), {
      providerId: ProviderId.fromString(providerId),
      status: AvailabilityStatus.Active,
      type: AvailabilityType.FullTime,
      availableFrom: new Date('2026-01-01T08:00:00Z'),
      availableTo: new Date('2026-01-01T17:00:00Z'),
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds an Availability by id', async () => {
    const availability = buildAvailability();

    await repository.save(availability);
    const found = await repository.findById(availability.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(availability.id)).toBe(true);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(AvailabilityId.create());
    expect(found).toBeNull();
  });

  it('finds Availabilities by providerId', async () => {
    const availability = buildAvailability();
    await repository.save(availability);

    const results = await repository.findByProviderId(
      ProviderId.fromString(providerId),
    );

    expect(results.some((a) => a.id.equals(availability.id))).toBe(true);
  });

  it('deletes an Availability', async () => {
    const availability = buildAvailability();
    await repository.save(availability);

    await repository.delete(availability.id);

    const found = await repository.findById(availability.id);
    expect(found).toBeNull();
  });

  it('lists Availabilities with pagination', async () => {
    await repository.save(buildAvailability());
    await repository.save(buildAvailability());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
  });

  it('searches Availabilities by type', async () => {
    await repository.save(buildAvailability());

    const results = await repository.search('full_time');

    expect(results.some((a) => a.type === AvailabilityType.FullTime)).toBe(
      true,
    );
  });
});
