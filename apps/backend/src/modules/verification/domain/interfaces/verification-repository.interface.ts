import { Verification } from '../entities/verification.entity';
import { VerificationId } from '../value-objects/verification-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Verification persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface VerificationRepository {
  findById(id: VerificationId): Promise<Verification | null>;
  findByIdentityId(identityId: IdentityId): Promise<Verification[]>;
  save(verification: Verification): Promise<void>;
}
