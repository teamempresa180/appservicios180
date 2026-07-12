import { PaginatedResult } from '../../../core/application/paginated-result';
import { Provider } from '../entities/provider.entity';
import { ProviderId } from '../value-objects/provider-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Provider persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 7: `PrismaProviderRepository`).
 *
 * `findByIdentityId` returns a single `Provider | null` (not an
 * array) — same real invariant already found with `Trust`: **at most
 * one `Provider` record per `Identity`**. `CreateProviderUseCase`
 * enforces it.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ProviderRepository` implementation by contract
 *  instead of by concrete class. */
export const PROVIDER_REPOSITORY = Symbol('ProviderRepository');

export interface ProviderRepository {
  findById(id: ProviderId): Promise<Provider | null>;
  findByIdentityId(identityId: IdentityId): Promise<Provider | null>;
  save(provider: Provider): Promise<void>;
  delete(id: ProviderId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Provider>>;
  /** Free-text match against `type`/`biography`. */
  search(term: string): Promise<Provider[]>;
}
