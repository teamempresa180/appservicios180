import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { DeleteIdentityCommand } from '../commands/delete-identity.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  execute(command: DeleteIdentityCommand): Promise<void> {
    void this.identityRepository;
    throw new Error(
      `DeleteIdentityUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
