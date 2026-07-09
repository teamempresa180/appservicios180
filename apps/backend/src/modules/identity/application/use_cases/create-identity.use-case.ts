import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityDto } from '../dto/identity.dto';
import { CreateIdentityCommand } from '../commands/create-identity.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  execute(command: CreateIdentityCommand): Promise<IdentityDto> {
    void this.identityRepository;
    throw new Error(
      `CreateIdentityUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
