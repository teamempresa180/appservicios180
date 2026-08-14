import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { Address } from '../../domain/entities/address.entity';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { UpdateAddressCommand } from '../commands/update-address.command';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';
import { AddressValidator } from '../validators/address.validator';

/**
 * Updates the mutable fields of an existing Address (`alias`,
 * `fullAddress`, `status`, `latitude`/`longitude`) —
 * `city`/`state`/`country`/`postalCode`/`type` are not offered by
 * `UpdateAddressCommand` (only by `UpdateAddressDto`, unused by any
 * command), so they stay untouched, same pattern as
 * `UpdateProfileUseCase` leaving `avatarUrl`/`bio` alone.
 * `latitude`/`longitude` are `undefined` when the caller doesn't touch
 * the pin (existing value kept) and `null` when the caller explicitly
 * clears it — see `AddressValidator.validateUpdate`.
 */
export class UpdateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(command: UpdateAddressCommand): Promise<AddressDto> {
    AddressValidator.validateUpdate(command);

    const id = AddressId.fromString(command.id);
    const existing = await this.addressRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Address ${command.id} not found`);
    }
    assertOwnership(command.caller, existing.identityId.value, 'Address');

    const updated = new Address(existing.id, {
      identityId: existing.identityId,
      alias: command.alias ?? existing.alias,
      fullAddress: command.fullAddress ?? existing.fullAddress,
      city: existing.city,
      state: existing.state,
      country: existing.country,
      postalCode: existing.postalCode,
      latitude:
        command.latitude !== undefined ? command.latitude : existing.latitude,
      longitude:
        command.longitude !== undefined
          ? command.longitude
          : existing.longitude,
      type: existing.type,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.addressRepository.save(updated);
    return AddressMapper.toDto(updated);
  }
}
