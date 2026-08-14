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
  /**
   * `identityId` restricts the page to the Verifications of a single
   * Identity; `null` means "no restriction" and is reserved for Admin
   * callers. A Verification carries KYC evidence, so an unrestricted
   * listing exposes who has been verified and with which documents.
   */
  list(
    page: number,
    pageSize: number,
    identityId: IdentityId | null,
  ): Promise<PaginatedResult<Verification>>;
  /** Free-text match against `type`/`status`, restricted to `identityId` when given. */
  search(term: string, identityId: IdentityId | null): Promise<Verification[]>;
}
