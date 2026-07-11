import { ProfileModel as PrismaProfile } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * Translates between the `Profile` domain entity and its Prisma row
 * shape (`ProfileModel`, mapped to the `profiles` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ProfilePrismaMapper {
  static toDomain(row: PrismaProfile): Profile {
    return new Profile(ProfileId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      bio: row.bio,
      visibility: row.visibility as unknown as ProfileVisibility,
      status: row.status as unknown as ProfileStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(profile: Profile): PrismaProfile {
    return {
      id: profile.id.value,
      identityId: profile.identityId.value,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      visibility: profile.visibility,
      status: profile.status,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
