import { Audit } from '../entities/audit.entity';
import { AuditId } from '../value-objects/audit-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Audit persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface AuditRepository {
  findById(id: AuditId): Promise<Audit | null>;
  findByIdentityId(identityId: IdentityId): Promise<Audit[]>;
  save(audit: Audit): Promise<void>;
}
