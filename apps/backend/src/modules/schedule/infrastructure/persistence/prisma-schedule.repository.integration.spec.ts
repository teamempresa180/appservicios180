import { PrismaClient } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { PrismaScheduleRepository } from './prisma-schedule.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaScheduleRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaScheduleRepository(prisma as never);
  let providerId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-schedule-it-${Date.now()}`,
        fullName: 'Schedule Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-SCHEDULE-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-schedule-it-${Date.now()}`,
        identityId: identity.id,
        displayName: 'Schedule Integration Owner',
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
        id: `provider-for-schedule-it-${Date.now()}`,
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

  function buildSchedule() {
    const now = new Date();
    return new Schedule(ScheduleId.create(), {
      providerId: ProviderId.fromString(providerId),
      startDateTime: new Date('2026-01-01T08:00:00Z'),
      endDateTime: new Date('2026-01-01T09:00:00Z'),
      status: ScheduleStatus.Open,
      type: ScheduleType.Regular,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Schedule block by id', async () => {
    const schedule = buildSchedule();

    await repository.save(schedule);
    const found = await repository.findById(schedule.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(schedule.id)).toBe(true);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ScheduleId.create());
    expect(found).toBeNull();
  });

  it('finds Schedule blocks by providerId', async () => {
    const schedule = buildSchedule();
    await repository.save(schedule);

    const results = await repository.findByProviderId(
      ProviderId.fromString(providerId),
    );

    expect(results.some((s) => s.id.equals(schedule.id))).toBe(true);
  });

  it('deletes a Schedule block', async () => {
    const schedule = buildSchedule();
    await repository.save(schedule);

    await repository.delete(schedule.id);

    const found = await repository.findById(schedule.id);
    expect(found).toBeNull();
  });

  it('lists Schedule blocks with pagination', async () => {
    await repository.save(buildSchedule());
    await repository.save(buildSchedule());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
  });

  it('searches Schedule blocks by type', async () => {
    await repository.save(buildSchedule());

    const results = await repository.search('regular');

    expect(results.some((s) => s.type === ScheduleType.Regular)).toBe(true);
  });
});
