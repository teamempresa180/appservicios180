import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { DeleteProviderCommand } from '../commands/delete-provider.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  execute(command: DeleteProviderCommand): Promise<void> {
    void this.providerRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
