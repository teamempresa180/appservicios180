import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { DeleteCredentialCommand } from '../commands/delete-credential.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  execute(command: DeleteCredentialCommand): Promise<void> {
    void this.credentialRepository;
    throw new Error(
      `DeleteCredentialUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
