import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialDto } from '../dto/credential.dto';
import { CreateCredentialCommand } from '../commands/create-credential.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  execute(command: CreateCredentialCommand): Promise<CredentialDto> {
    void this.credentialRepository;
    throw new Error(
      `CreateCredentialUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
