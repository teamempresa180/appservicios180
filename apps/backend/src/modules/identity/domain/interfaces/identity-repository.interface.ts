import { PaginatedResult } from '../../../core/application/paginated-result';
import { Identity } from '../entities/identity.entity';
import { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * Contract for Identity persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3, Etapa 2:
 * `PrismaIdentityRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `IdentityRepository` implementation by contract
 *  instead of by concrete class. */
export const IDENTITY_REPOSITORY = Symbol('IdentityRepository');

export interface IdentityRepository {
  findById(id: IdentityId): Promise<Identity | null>;
  save(identity: Identity): Promise<void>;
  delete(id: IdentityId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Identity>>;
  /** Free-text match against `fullName`/`documentNumber`. */
  search(term: string): Promise<Identity[]>;
}
