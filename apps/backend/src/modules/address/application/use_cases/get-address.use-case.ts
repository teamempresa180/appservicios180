import { AddressRepository } from '../../domain/interfaces/address-repository.interface';
import { AddressDto } from '../dto/address.dto';
import { GetAddressQuery } from '../queries/get-address.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  execute(query: GetAddressQuery): Promise<AddressDto | null> {
    void this.addressRepository;
    throw new Error(
      `GetAddressUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
