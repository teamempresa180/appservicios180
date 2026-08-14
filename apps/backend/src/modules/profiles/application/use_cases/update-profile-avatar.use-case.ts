import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { UpdateProfileAvatarCommand } from '../commands/update-profile-avatar.command';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileValidator } from '../validators/profile.validator';

/**
 * Attaches an already-stored file's relative path to an existing
 * Profile's `avatarUrl`. Same single-field-mutation shape as
 * `UpdateProfileUseCase`: validates the command, confirms the Profile
 * exists, rebuilds it with only `avatarUrl` (and `updatedAt`) changed,
 * and persists via `save`. The file itself is already on disk by the
 * time this use case runs (see `LocalProfileAvatarStorageService`,
 * invoked from the controller before this use case) — this only ever
 * deals with the path string, never file bytes, keeping the
 * Application layer free of any filesystem/multipart concerns.
 *
 * Only the owning Identity (or an `Admin`) may replace an avatar —
 * same rule as `UpdateProfileUseCase`. The controller additionally
 * runs `GetProfileUseCase` before writing any bytes to disk, so an
 * upload aimed at someone else's Profile is rejected before the file
 * is stored.
 */
export class UpdateProfileAvatarUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(command: UpdateProfileAvatarCommand): Promise<ProfileDto> {
    ProfileValidator.validateUpdateAvatar(command);

    const id = ProfileId.fromString(command.id);
    const existing = await this.profileRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Profile ${command.id} not found`);
    }
    if (
      existing.identityId.value !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        "You may only change your own Profile's avatar",
      );
    }

    const updated = new Profile(existing.id, {
      identityId: existing.identityId,
      displayName: existing.displayName,
      avatarUrl: command.avatarUrl,
      bio: existing.bio,
      visibility: existing.visibility,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.profileRepository.save(updated);
    return ProfileMapper.toDto(updated);
  }
}
