import { PaginatedResult } from '../../../core/application/paginated-result';
import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { ListAddressQuery } from '../queries/list-address.query';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';

/**
 * Lists the caller's own Addresses page by page. The scope is applied
 * in the repository query (not filtered after the fact) so `total`
 * and the page window both describe the caller's own records only —
 * an Address is personal data and was never meant to be readable
 * across Identities. An `Admin` caller lists every Address.
 */
export class ListAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(query: ListAddressQuery): Promise<PaginatedResult<AddressDto>> {
    const scope = ownershipScope(query.caller);
    const result = await this.addressRepository.list(
      query.page,
      query.pageSize,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return {
      items: result.items.map((address) => AddressMapper.toDto(address)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
