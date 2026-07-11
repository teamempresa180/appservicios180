import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';

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
}
