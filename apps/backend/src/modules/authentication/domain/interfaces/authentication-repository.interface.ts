import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Authentication } from '../entities/authentication.entity';
import { AuthenticationId } from '../value-objects/authentication-id.value-object';

/**
 * Contract for Authentication persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer (Sprint 3,
 * Etapa 2: `PrismaAuthenticationRepository`).
 */
/** DI token — see `IDENTITY_REPOSITORY` for why this exists. */
export const AUTHENTICATION_REPOSITORY = Symbol('AuthenticationRepository');

export interface AuthenticationRepository {
  findById(id: AuthenticationId): Promise<Authentication | null>;
  findByIdentityId(identityId: IdentityId): Promise<Authentication[]>;
  save(authentication: Authentication): Promise<void>;
  delete(id: AuthenticationId): Promise<void>;
  list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Authentication>>;
  /** Free-text match against `methodType`/`status`. */
  search(term: string): Promise<Authentication[]>;
}
