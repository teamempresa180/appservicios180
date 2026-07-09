import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressDto } from '../dto/address.dto';
import { UpdateAddressCommand } from '../commands/update-address.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(command: UpdateAddressCommand): Promise<AddressDto> {
    void this.addressRepository;
    throw new Error(
      `UpdateAddressUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
