import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { UpdateProfileAvatarCommand } from '../commands/update-profile-avatar.command';

/** Mimetypes accepted for a Profile avatar upload — kept next to the
 *  validator (not the controller) so both the HTTP layer and any
 *  future caller of `UpdateProfileAvatarUseCase` enforce the same
 *  allow-list. Images only (no PDF — this is a photo, not a
 *  document, unlike Verification's document upload). */
export const ALLOWED_PROFILE_AVATAR_MIME_TYPES = [
  'image/png',
  'image/jpeg',
] as const;

/**
 * Structural validation for Profile commands — required fields,
 * well-formed values. No business rules (e.g. no uniqueness-per-Identity
 * check — the repository contract's `findByIdentityId` returns
 * `Profile[]`, so multiple profiles per Identity are allowed and
 * nothing in `profiles/domain` documents a limit).
 */
export class ProfileValidator {
  static validateCreate(command: CreateProfileCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!command.displayName?.trim()) {
      throw new ValidationException('displayName is required');
    }
    if (!Object.values(ProfileVisibility).includes(command.visibility)) {
      throw new ValidationException(
        `visibility must be one of: ${Object.values(ProfileVisibility).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateProfileCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.displayName !== undefined && !command.displayName.trim()) {
      throw new ValidationException('displayName cannot be blank');
    }
    if (
      command.visibility !== undefined &&
      !Object.values(ProfileVisibility).includes(command.visibility)
    ) {
      throw new ValidationException(
        `visibility must be one of: ${Object.values(ProfileVisibility).join(', ')}`,
      );
    }
    if (
      command.status !== undefined &&
      !Object.values(ProfileStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(ProfileStatus).join(', ')}`,
      );
    }
  }

  static validateUpdateAvatar(command: UpdateProfileAvatarCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (!command.avatarUrl?.trim()) {
      throw new ValidationException('avatarUrl is required');
    }
  }

  /** Rejects any mimetype outside `ALLOWED_PROFILE_AVATAR_MIME_TYPES`
   *  — called before the file is written to disk, so an invalid
   *  upload never reaches the filesystem. */
  static validateAvatarMimeType(mimetype: string | undefined): void {
    if (
      !mimetype ||
      !(ALLOWED_PROFILE_AVATAR_MIME_TYPES as readonly string[]).includes(
        mimetype,
      )
    ) {
      throw new ValidationException(
        `file must be one of: ${ALLOWED_PROFILE_AVATAR_MIME_TYPES.join(', ')}`,
      );
    }
  }
}
