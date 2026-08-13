import { PaginatedResult } from '../../../core/application/paginated-result';
import { Address } from '../entities/address.entity';
import { AddressId } from '../value-objects/address-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Address persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3, Etapa 4:
 * `PrismaAddressRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `AddressRepository` implementation by contract
 *  instead of by concrete class. */
export const ADDRESS_REPOSITORY = Symbol('AddressRepository');

export interface AddressRepository {
  findById(id: AddressId): Promise<Address | null>;
  findByIdentityId(identityId: IdentityId): Promise<Address[]>;
  save(address: Address): Promise<void>;
  delete(id: AddressId): Promise<void>;
  /**
   * Paginates Addresses. `identityId` restricts the page (and its
   * `total`) to that Identity's own Addresses — an Address is personal
   * data, so callers list their own unless they are an `Admin`, in
   * which case the scope is omitted.
   */
  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Address>>;
  /**
   * Free-text match against `alias`/`fullAddress`/`city`, scoped to
   * `identityId` when given — same ownership rule as `list`.
   */
  search(term: string, identityId?: IdentityId): Promise<Address[]>;
}
