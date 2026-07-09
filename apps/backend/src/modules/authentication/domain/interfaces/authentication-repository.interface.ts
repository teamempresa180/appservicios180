import { Authentication } from '../entities/authentication.entity';
import { AuthenticationId } from '../value-objects/authentication-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Authentication persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface AuthenticationRepository {
  findById(id: AuthenticationId): Promise<Authentication | null>;
  findByIdentityId(identityId: IdentityId): Promise<Authentication[]>;
  save(authentication: Authentication): Promise<void>;
}
