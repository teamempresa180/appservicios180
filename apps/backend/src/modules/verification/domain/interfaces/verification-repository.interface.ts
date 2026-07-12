import { PaginatedResult } from '../../../core/application/paginated-result';
import { Verification } from '../entities/verification.entity';
import { VerificationId } from '../value-objects/verification-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Verification persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 5: `PrismaVerificationRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `VerificationRepository` implementation by
 *  contract instead of by concrete class. */
export const VERIFICATION_REPOSITORY = Symbol('VerificationRepository');

export interface VerificationRepository {
  findById(id: VerificationId): Promise<Verification | null>;
  findByIdentityId(identityId: IdentityId): Promise<Verification[]>;
  save(verification: Verification): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Verification>>;
  /** Free-text match against `type`/`status`. */
  search(term: string): Promise<Verification[]>;
}
