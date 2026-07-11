import { PaginatedResult } from '../../../core/application/paginated-result';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { ListAddressQuery } from '../queries/list-address.query';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';

/** Lists Addresses page by page. */
export class ListAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(query: ListAddressQuery): Promise<PaginatedResult<AddressDto>> {
    const result = await this.addressRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((address) => AddressMapper.toDto(address)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
