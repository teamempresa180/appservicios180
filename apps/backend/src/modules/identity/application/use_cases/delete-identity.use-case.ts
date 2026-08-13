import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { DeleteIdentityCommand } from '../commands/delete-identity.command';

/**
 * Deletes an existing Identity. Cross-module cascade rules (what
 * happens to `Authentication`/`Credential`/`Profile` records
 * referencing this `IdentityId`) aren't documented anywhere yet — not
 * implemented here to avoid inventing a policy the domain hasn't
 * specified.
 *
 * Only the owning caller (or an `Admin`) may delete an Identity — see
 * `UpdateIdentityUseCase` for why the check precedes the lookup.
 */
export class DeleteIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(command: DeleteIdentityCommand): Promise<void> {
    if (command.id !== command.callerId && command.callerRole !== Role.Admin) {
      throw new ForbiddenException('You may only delete your own Identity');
    }

    const id = IdentityId.fromString(command.id);
    const existing = await this.identityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Identity ${command.id} not found`);
    }
    await this.identityRepository.delete(id);
  }
}
