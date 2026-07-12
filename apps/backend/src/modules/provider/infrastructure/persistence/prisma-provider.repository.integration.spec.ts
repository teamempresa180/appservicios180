import { PrismaClient } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { PrismaProviderRepository } from './prisma-provider.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaProviderRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaProviderRepository(prisma as never);

  async function createIdentityAndProfile(): Promise<{
    identityId: string;
    profileId: string;
  }> {
    const identity = await prisma.identityModel.create({
      data: {
        id: `identity-for-provider-it-${Date.now()}-${Math.random()}`,
        fullName: 'Provider Integration Owner',
        documentType: 'NATIONAL_ID',
        documentNumber: `IT-PROVIDER-${Date.now()}-${Math.random()}`,
        birthDate: new Date('1995-06-15'),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const profile = await prisma.profileModel.create({
      data: {
        id: `profile-for-provider-it-${Date.now()}-${Math.random()}`,
        identityId: identity.id,
        displayName: 'Provider Integration Owner',
        avatarUrl: null,
        bio: null,
        visibility: 'PUBLIC',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return { identityId: identity.id, profileId: profile.id };
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildProvider(identityId: string, profileId: string) {
    const now = new Date();
    return new Provider(ProviderId.create(), {
      identityId: IdentityId.fromString(identityId),
      providerProfileId: ProfileId.fromString(profileId),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Integration test provider',
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Provider by id', async () => {
    const { identityId, profileId } = await createIdentityAndProfile();
    const provider = buildProvider(identityId, profileId);

    await repository.save(provider);
    const found = await repository.findById(provider.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(provider.id)).toBe(true);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(ProviderId.create());
    expect(found).toBeNull();
  });

  it('finds a Provider by identityId (singular, not array)', async () => {
    const { identityId, profileId } = await createIdentityAndProfile();
    const provider = buildProvider(identityId, profileId);
    await repository.save(provider);

    const found = await repository.findByIdentityId(
      IdentityId.fromString(identityId),
    );

    expect(found?.id.equals(provider.id)).toBe(true);
  });

  it('updates an existing Provider on save (upsert)', async () => {
    const { identityId, profileId } = await createIdentityAndProfile();
    const provider = buildProvider(identityId, profileId);
    await repository.save(provider);

    const updated = new Provider(provider.id, {
      identityId: provider.identityId,
      providerProfileId: provider.providerProfileId,
      status: provider.status,
      type: provider.type,
      experience: ProviderExperience.Expert,
      biography: 'Updated bio',
      yearsOfExperience: provider.yearsOfExperience,
      createdAt: provider.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(provider.id);
    expect(found?.biography).toBe('Updated bio');
  });

  it('lists Providers with pagination', async () => {
    const first = await createIdentityAndProfile();
    const second = await createIdentityAndProfile();
    await repository.save(buildProvider(first.identityId, first.profileId));
    await repository.save(buildProvider(second.identityId, second.profileId));

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
  });

  it('searches Providers by biography', async () => {
    const { identityId, profileId } = await createIdentityAndProfile();
    const marker = `Searchable-${Date.now()}`;
    const now = new Date();
    const provider = new Provider(ProviderId.create(), {
      identityId: IdentityId.fromString(identityId),
      providerProfileId: ProfileId.fromString(profileId),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: marker,
      yearsOfExperience: 5,
      createdAt: now,
      updatedAt: now,
    });
    await repository.save(provider);

    const results = await repository.search(marker);

    expect(results.some((p) => p.biography === marker)).toBe(true);
  });
});
