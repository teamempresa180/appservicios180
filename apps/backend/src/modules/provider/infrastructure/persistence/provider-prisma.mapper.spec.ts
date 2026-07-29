import { ProviderModel as PrismaProvider } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderPrismaMapper } from './provider-prisma.mapper';

describe('ProviderPrismaMapper', () => {
  const row: PrismaProvider = {
    id: 'id-1',
    identityId: 'identity-1',
    providerProfileId: 'profile-1',
    categoryId: null,
    specialization: null,
    status: 'ACTIVE',
    type: 'INDEPENDENT',
    experience: 'INTERMEDIATE',
    biography: 'bio',
    yearsOfExperience: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const provider = ProviderPrismaMapper.toDomain(row);

    expect(provider.id.value).toBe('id-1');
    expect(provider.identityId.value).toBe('identity-1');
    expect(provider.providerProfileId.value).toBe('profile-1');
    expect(provider.status).toBe(ProviderStatus.Active);
    expect(provider.type).toBe(ProviderType.Independent);
    expect(provider.experience).toBe(ProviderExperience.Intermediate);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const provider = new Provider(ProviderId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      providerProfileId: ProfileId.fromString('profile-1'),
      status: ProviderStatus.Active,
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'bio',
      yearsOfExperience: 5,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ProviderPrismaMapper.toPersistence(provider)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const provider = ProviderPrismaMapper.toDomain(row);
    expect(ProviderPrismaMapper.toPersistence(provider)).toEqual(row);
  });
});
