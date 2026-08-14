import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileValidator } from '../validators/profile.validator';

/**
 * Updates the mutable fields of an existing Profile (`displayName`,
 * `visibility`, `status`) — `avatarUrl`/`bio` are not offered by
 * `UpdateProfileCommand` (only by `UpdateProfileDto`, unused by any
 * command), so they stay untouched, same pattern as
 * `UpdateIdentityUseCase` leaving `documentType`/`documentNumber`/
 * `birthDate` alone.
 *
 * Only the owning Identity (or an `Admin`) may update a Profile. The
 * record is loaded first to learn its `identityId`, so a caller aiming
 * at someone else's Profile gets a 403 and one aiming at a
 * non-existent id gets a 404.
 */
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileDto> {
    ProfileValidator.validateUpdate(command);

    const id = ProfileId.fromString(command.id);
    const existing = await this.profileRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Profile ${command.id} not found`);
    }
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException('You may only update your own Profile');
    }

    const updated = new Profile(existing.id, {
      identityId: existing.identityId,
      displayName: command.displayName ?? existing.displayName,
      avatarUrl: existing.avatarUrl,
      bio: existing.bio,
      visibility: command.visibility ?? existing.visibility,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.profileRepository.save(updated);
    return ProfileMapper.toDto(updated);
  }
}
