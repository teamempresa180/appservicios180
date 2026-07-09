import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { DeleteAuthenticationCommand } from '../commands/delete-authentication.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  execute(command: DeleteAuthenticationCommand): Promise<void> {
    void this.authenticationRepository;
    throw new Error(
      `DeleteAuthenticationUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
