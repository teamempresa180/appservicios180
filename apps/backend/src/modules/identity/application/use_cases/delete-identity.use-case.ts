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
 */
export class DeleteIdentityUseCase {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async execute(command: DeleteIdentityCommand): Promise<void> {
    const id = IdentityId.fromString(command.id);
    const existing = await this.identityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Identity ${command.id} not found`);
    }
    await this.identityRepository.delete(id);
  }
}
