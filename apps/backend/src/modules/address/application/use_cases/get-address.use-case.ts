import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { GetAddressQuery } from '../queries/get-address.query';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';

/**
 * Fetches a single Address by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase` — and
 * `ForbiddenException` when the Address belongs to another Identity,
 * so a guessed id cannot be used to read someone else's address.
 */
export class GetAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(query: GetAddressQuery): Promise<AddressDto> {
    const address = await this.addressRepository.findById(
      AddressId.fromString(query.id),
    );
    if (!address) {
      throw new NotFoundException(`Address ${query.id} not found`);
    }
    assertOwnership(query.caller, address.identityId.value, 'Address');
    return AddressMapper.toDto(address);
  }
}
