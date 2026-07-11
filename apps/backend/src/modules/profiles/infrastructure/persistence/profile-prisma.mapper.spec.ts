import { ProfileModel as PrismaProfile } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfilePrismaMapper } from './profile-prisma.mapper';

describe('ProfilePrismaMapper', () => {
  const row: PrismaProfile = {
    id: 'id-1',
    identityId: 'identity-1',
    displayName: 'Ana',
    avatarUrl: null,
    bio: null,
    visibility: 'PUBLIC',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const profile = ProfilePrismaMapper.toDomain(row);

    expect(profile.id.value).toBe('id-1');
    expect(profile.identityId.value).toBe('identity-1');
    expect(profile.displayName).toBe('Ana');
    expect(profile.visibility).toBe(ProfileVisibility.Public);
    expect(profile.status).toBe(ProfileStatus.Active);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const profile = new Profile(ProfileId.fromString('id-1'), {
      identityId: IdentityId.fromString('identity-1'),
      displayName: 'Ana',
      avatarUrl: null,
      bio: null,
      visibility: ProfileVisibility.Public,
      status: ProfileStatus.Active,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ProfilePrismaMapper.toPersistence(profile)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const profile = ProfilePrismaMapper.toDomain(row);
    expect(ProfilePrismaMapper.toPersistence(profile)).toEqual(row);
  });
});
