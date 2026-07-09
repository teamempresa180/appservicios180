import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustDto } from '../dto/trust.dto';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateTrustProfileUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  execute(command: UpdateTrustProfileCommand): Promise<TrustDto> {
    void this.trustRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
