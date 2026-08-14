import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { DeleteAddressCommand } from '../commands/delete-address.command';

/**
 * Deletes an existing Address owned by the caller. No cascade rule is
 * documented for what happens to other data referencing this
 * `AddressId` — none exists today, so there is nothing to cascade.
 */
export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const id = AddressId.fromString(command.id);
    const existing = await this.addressRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Address ${command.id} not found`);
    }
    assertOwnership(command.caller, existing.identityId.value, 'Address');
    await this.addressRepository.delete(id);
  }
}
