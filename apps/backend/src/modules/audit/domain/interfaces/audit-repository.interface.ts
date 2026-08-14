import { PaginatedResult } from '../../../core/application/paginated-result';
import { Audit } from '../entities/audit.entity';
import { AuditId } from '../value-objects/audit-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Audit persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3,
 * Etapa 5: `PrismaAuditRepository`). No `delete` method — audit
 * records are immutable by design (see `CreateAuditRecordCommand`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `AuditRepository` implementation by contract
 *  instead of by concrete class. */
export const AUDIT_REPOSITORY = Symbol('AuditRepository');

export interface AuditRepository {
  findById(id: AuditId): Promise<Audit | null>;
  findByIdentityId(identityId: IdentityId): Promise<Audit[]>;
  save(audit: Audit): Promise<void>;
  /**
   * Paginates Audit records. `identityId` restricts the page (and its
   * `total`) to that Identity's own trail — an audit entry names what
   * a specific user did and when, so callers read their own unless
   * they are an `Admin`, in which case the scope is omitted.
   */
  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Audit>>;
  /**
   * Free-text match against `description`/`actionType`, scoped to
   * `identityId` when given — same ownership rule as `list`.
   */
  search(term: string, identityId?: IdentityId): Promise<Audit[]>;
}
