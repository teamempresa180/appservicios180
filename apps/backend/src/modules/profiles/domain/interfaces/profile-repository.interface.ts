import { Profile } from '../entities/profile.entity';
import { ProfileId } from '../value-objects/profile-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Profile persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ProfileRepository {
  findById(id: ProfileId): Promise<Profile | null>;
  findByIdentityId(identityId: IdentityId): Promise<Profile[]>;
  save(profile: Profile): Promise<void>;
}
