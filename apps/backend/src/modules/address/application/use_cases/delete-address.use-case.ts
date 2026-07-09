import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { DeleteAddressCommand } from '../commands/delete-address.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(command: DeleteAddressCommand): Promise<void> {
    void this.addressRepository;
    throw new Error(
      `DeleteAddressUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
