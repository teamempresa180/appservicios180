import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityDto } from '../dto/identity.dto';
import { GetIdentityQuery } from '../queries/get-identity.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  execute(query: GetIdentityQuery): Promise<IdentityDto | null> {
    void this.identityRepository;
    throw new Error(
      `GetIdentityUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
