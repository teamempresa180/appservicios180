import { Address } from '../entities/address.entity';
import { AddressId } from '../value-objects/address-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Address persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface AddressRepository {
  findById(id: AddressId): Promise<Address | null>;
  findByIdentityId(identityId: IdentityId): Promise<Address[]>;
  save(address: Address): Promise<void>;
}
