import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialDto } from '../dto/credential.dto';
import { GetCredentialQuery } from '../queries/get-credential.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  execute(query: GetCredentialQuery): Promise<CredentialDto | null> {
    void this.credentialRepository;
    throw new Error(
      `GetCredentialUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
