import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { DeleteAuthenticationCommand } from '../commands/delete-authentication.command';

export class DeleteAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(command: DeleteAuthenticationCommand): Promise<void> {
    const id = AuthenticationId.fromString(command.id);
    const existing = await this.authenticationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Authentication ${command.id} not found`);
    }
    await this.authenticationRepository.delete(id);
  }
}
