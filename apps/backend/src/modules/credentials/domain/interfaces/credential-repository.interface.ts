import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../entities/credential.entity';
import { CredentialId } from '../value-objects/credential-id.value-object';

/**
 * Contract for Credential persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer (Sprint 3,
 * Etapa 2: `PrismaCredentialRepository`).
 */
/** DI token — see `IDENTITY_REPOSITORY` for why this exists. */
export const CREDENTIAL_REPOSITORY = Symbol('CredentialRepository');

export interface CredentialRepository {
  findById(id: CredentialId): Promise<Credential | null>;
  findByIdentityId(identityId: IdentityId): Promise<Credential[]>;
  save(credential: Credential): Promise<void>;
  delete(id: CredentialId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Credential>>;
  /** Free-text match against `type`/`status`. */
  search(term: string): Promise<Credential[]>;
}
