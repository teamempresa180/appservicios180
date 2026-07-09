import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressDto } from '../dto/address.dto';
import { CreateAddressCommand } from '../commands/create-address.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(command: CreateAddressCommand): Promise<AddressDto> {
    void this.addressRepository;
    throw new Error(
      `CreateAddressUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
