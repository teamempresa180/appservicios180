import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../domain/entities/address.entity';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { AddressDto } from '../dto/address.dto';
import { AddressMapper } from '../mappers/address.mapper';
import { AddressValidator } from '../validators/address.validator';

/**
 * Creates a new Address for an existing Identity, always in `Active`
 * status. Depends on `IdentityRepository` (not just its own) to verify
 * the referenced Identity actually exists before creating an address
 * for it — same rule already applied to `Contact`/`Profile`, since
 * `Address` also references `IdentityId`.
 *
 * The `identityId` in the command is caller-supplied, so it is checked
 * against the authenticated caller: an Address can only be created for
 * one's own Identity (an `Admin` may create it for anyone).
 */
export class CreateAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateAddressCommand): Promise<AddressDto> {
    AddressValidator.validateCreate(command);
    assertOwnership(command.caller, command.identityId, 'Address');

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const address = new Address(AddressId.create(), {
      identityId,
      alias: command.alias,
      fullAddress: command.fullAddress,
      city: command.city,
      state: command.state,
      country: command.country,
      postalCode: command.postalCode,
      latitude: command.latitude ?? null,
      longitude: command.longitude ?? null,
      type: command.type,
      status: AddressStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.addressRepository.save(address);
    return AddressMapper.toDto(address);
  }
}
