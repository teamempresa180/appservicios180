import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { PrismaProfileRepository } from './prisma-profile.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaProfileRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaProfileRepository(prisma as never);
  let identityId: string;

  beforeAll(async () => {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-profile-it-${Date.now()}`,
        fullName: 'Profile Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-PROFILE-${Date.now()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    identityId = identity.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildProfile(overrides: Partial<{ displayName: string }> = {}) {
    const now = new Date();
    return new Profile(ProfileId.create(), {
      identityId: IdentityId.fromString(identityId),
      displayName: overrides.displayName ?? 'Integration Test Profile',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Profile by id', async () => {
    const profile = buildProfile();

    await repository.save(profile);
    const found = await repository.findById(profile.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(profile.id)).toBe(true);
    expect(found?.displayName).toBe(profile.displayName);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ProfileId.create());
    expect(found).toBeNull();
  });

  it('finds Profiles by identityId', async () => {
    const profile = buildProfile();
    await repository.save(profile);

    const results = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(results.some((p) => p.id.equals(profile.id))).toBe(true);
  });

  it('updates an existing Profile on save (upsert)', async () => {
    const profile = buildProfile({ displayName: 'Before Update' });
    await repository.save(profile);

    const updated = new Profile(profile.id, {
      identityId: profile.identityId,
      displayName: 'After Update',
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      visibility: profile.visibility,
      status: profile.status,
      createdAt: profile.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(profile.id);
    expect(found?.displayName).toBe('After Update');
  });

  it('deletes a Profile', async () => {
    const profile = buildProfile();
    await repository.save(profile);

    await repository.delete(profile.id);

    const found = await repository.findById(profile.id);
    expect(found).toBeNull();
  });

  it('lists Profiles with pagination', async () => {
    await repository.save(buildProfile());
    await repository.save(buildProfile());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Profiles by displayName', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildProfile({ displayName: marker }));

    const results = await repository.search(marker);

    expect(results.some((profile) => profile.displayName === marker)).toBe(
      true,
    );
  });
});
