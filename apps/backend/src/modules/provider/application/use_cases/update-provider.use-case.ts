import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderDto } from '../dto/provider.dto';
import { UpdateProviderCommand } from '../commands/update-provider.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateProviderUseCase {
  constructor(private readonly providerRepository: ProviderRepository) {}

  execute(command: UpdateProviderCommand): Promise<ProviderDto> {
    void this.providerRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
