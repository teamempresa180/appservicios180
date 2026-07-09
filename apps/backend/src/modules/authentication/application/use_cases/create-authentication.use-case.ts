import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationDto } from '../dto/authentication.dto';
import { CreateAuthenticationCommand } from '../commands/create-authentication.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  execute(command: CreateAuthenticationCommand): Promise<AuthenticationDto> {
    void this.authenticationRepository;
    throw new Error(
      `CreateAuthenticationUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
