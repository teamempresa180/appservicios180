import { PaginatedResult } from '../../../core/application/paginated-result';
import { Profile } from '../entities/profile.entity';
import { ProfileId } from '../value-objects/profile-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Profile persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3, Etapa 3:
 * `PrismaProfileRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ProfileRepository` implementation by contract
 *  instead of by concrete class. */
export const PROFILE_REPOSITORY = Symbol('ProfileRepository');

export interface ProfileRepository {
  findById(id: ProfileId): Promise<Profile | null>;
  findByIdentityId(identityId: IdentityId): Promise<Profile[]>;
  save(profile: Profile): Promise<void>;
  delete(id: ProfileId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Profile>>;
  /** Free-text match against `displayName`/`bio`. */
  search(term: string): Promise<Profile[]>;
}
