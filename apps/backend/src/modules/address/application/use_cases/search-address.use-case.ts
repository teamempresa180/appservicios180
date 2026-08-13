import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { SearchAddressQuery } from '../queries/search-address.query';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';

/**
 * Free-text search over `alias`/`fullAddress`/`city`, restricted to
 * the caller's own Addresses — same ownership rule as
 * `ListAddressUseCase`, so search can't be used to walk around the
 * listing's scope.
 */
export class SearchAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(query: SearchAddressQuery): Promise<AddressDto[]> {
    const scope = ownershipScope(query.caller);
    const results = await this.addressRepository.search(
      query.term,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return results.map((address) => AddressMapper.toDto(address));
  }
}
