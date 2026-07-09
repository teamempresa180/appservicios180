import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialDto } from '../dto/credential.dto';
import { UpdateCredentialCommand } from '../commands/update-credential.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  execute(command: UpdateCredentialCommand): Promise<CredentialDto> {
    void this.credentialRepository;
    throw new Error(
      `UpdateCredentialUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
