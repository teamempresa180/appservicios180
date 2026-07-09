import { Trust } from '../entities/trust.entity';
import { TrustId } from '../value-objects/trust-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Trust persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface TrustRepository {
  findById(id: TrustId): Promise<Trust | null>;
  findByIdentityId(identityId: IdentityId): Promise<Trust | null>;
  save(trust: Trust): Promise<void>;
}
