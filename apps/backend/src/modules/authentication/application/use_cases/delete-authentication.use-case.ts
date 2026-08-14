import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../domain/value-objects/authentication-id.value-object';
import { DeleteAuthenticationCommand } from '../commands/delete-authentication.command';

/**
 * Deletes an Authentication method. Only the Identity it belongs to
 * (or an `Admin`) may do so — see `UpdateAuthenticationUseCase` for
 * why ownership is checked after the lookup rather than before it.
 */
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
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only delete your own Authentication methods',
      );
    }
    await this.authenticationRepository.delete(id);
  }
}
