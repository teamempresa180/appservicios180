import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { DeleteProfileCommand } from '../commands/delete-profile.command';

/**
 * Deletes an existing Profile. No cascade rule is documented for what
 * happens to other data referencing this `ProfileId` — none exists
 * today (`Contact`/`Address` reference `IdentityId` directly, not
 * `ProfileId`), so there is nothing to cascade.
 */
export class DeleteProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const id = ProfileId.fromString(command.id);
    const existing = await this.profileRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Profile ${command.id} not found`);
    }
    await this.profileRepository.delete(id);
  }
}
