import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { DeleteProviderCommand } from '../commands/delete-provider.command';

/**
 * Deletes an existing Provider. No cascade rule is documented for
 * what happens to `Service`/`Availability`/`Schedule` records
 * referencing this `ProviderId` — same criterion as every other
 * `Delete*UseCase`.
 */
export class DeleteProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  async execute(command: DeleteProviderCommand): Promise<void> {
    const id = ProviderId.fromString(command.id);
    const existing = await this.providerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Provider ${command.id} not found`);
    }
    await this.providerRepository.delete(id);
  }
}
