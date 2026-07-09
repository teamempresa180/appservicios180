import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityDto } from '../dto/identity.dto';
import { UpdateIdentityCommand } from '../commands/update-identity.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  execute(command: UpdateIdentityCommand): Promise<IdentityDto> {
    void this.identityRepository;
    throw new Error(
      `UpdateIdentityUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
