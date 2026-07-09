import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationDto } from '../dto/authentication.dto';
import { GetAuthenticationQuery } from '../queries/get-authentication.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  execute(query: GetAuthenticationQuery): Promise<AuthenticationDto | null> {
    void this.authenticationRepository;
    throw new Error(
      `GetAuthenticationUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
