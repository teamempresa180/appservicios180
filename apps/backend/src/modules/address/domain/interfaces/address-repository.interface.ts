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
  list(page: number, pageSize: number): Promise<PaginatedResult<Address>>;
  /** Free-text match against `alias`/`fullAddress`/`city`. */
  search(term: string): Promise<Address[]>;
}
