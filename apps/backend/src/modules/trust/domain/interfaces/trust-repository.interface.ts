import { PaginatedResult } from '../../../core/application/paginated-result';
import { Trust } from '../entities/trust.entity';
import { TrustId } from '../value-objects/trust-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Trust persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3,
 * Etapa 5: `PrismaTrustRepository`).
 *
 * `findByIdentityId` returns a single `Trust | null` (not an array,
 * unlike every other module referencing `IdentityId`) — this is a
 * real domain invariant: **at most one `Trust` record per `Identity`**.
 * `CreateTrustProfileUseCase` enforces it.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `TrustRepository` implementation by contract
 *  instead of by concrete class. */
export const TRUST_REPOSITORY = Symbol('TrustRepository');

export interface TrustRepository {
  findById(id: TrustId): Promise<Trust | null>;
  findByIdentityId(identityId: IdentityId): Promise<Trust | null>;
  save(trust: Trust): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Trust>>;
  /** Free-text match against `level`/`status`. */
  search(term: string): Promise<Trust[]>;
}
