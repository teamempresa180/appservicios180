import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { DeleteProfileCommand } from '../commands/delete-profile.command';

/**
 * Deletes an existing Profile. No cascade rule is documented for what
 * happens to other data referencing this `ProfileId` — none exists
 * today (`Contact`/`Address` reference `IdentityId` directly, not
 * `ProfileId`), so there is nothing to cascade.
 *
 * Only the owning Identity (or an `Admin`) may delete a Profile — see
 * `UpdateProfileUseCase` for why ownership is checked after the
 * lookup.
 */
export class DeleteProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const id = ProfileId.fromString(command.id);
    const existing = await this.profileRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Profile ${command.id} not found`);
    }
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException('You may only delete your own Profile');
    }
    await this.profileRepository.delete(id);
  }
}
