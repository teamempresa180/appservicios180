import { Identity } from '../entities/identity.entity';
import { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Contract for Identity persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface IdentityRepository {
  findById(id: IdentityId): Promise<Identity | null>;
  save(identity: Identity): Promise<void>;
}
