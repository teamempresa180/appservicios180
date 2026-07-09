import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustDto } from '../dto/trust.dto';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateTrustProfileUseCase {
  constructor(private readonly trustRepository: TrustRepository) {}

  execute(command: CreateTrustProfileCommand): Promise<TrustDto> {
    void this.trustRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
