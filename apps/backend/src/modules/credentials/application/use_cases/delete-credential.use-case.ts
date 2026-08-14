import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CredentialRepository } from '../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../domain/value-objects/credential-id.value-object';
import { DeleteCredentialCommand } from '../commands/delete-credential.command';

/**
 * Deletes a Credential record. Only the Identity it belongs to (or an
 * `Admin`) may do so — see `UpdateCredentialUseCase` for why ownership
 * is checked after the lookup rather than before it.
 */
export class DeleteCredentialUseCase {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async execute(command: DeleteCredentialCommand): Promise<void> {
    const id = CredentialId.fromString(command.id);
    const existing = await this.credentialRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Credential ${command.id} not found`);
    }
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only delete your own Credential records',
      );
    }
    await this.credentialRepository.delete(id);
  }
}
