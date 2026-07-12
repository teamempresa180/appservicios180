import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';

/**
 * Structural validation for Trust commands — required fields,
 * well-formed values. No range validation on `score` — `TrustScore`
 * (the value object) is documented as "no range validation, no
 * calculation logic", so no min/max is invented here. Uniqueness
 * (at most one `Trust` per `Identity`) is a business rule enforced by
 * `CreateTrustProfileUseCase`, not structural validation.
 */
export class TrustValidator {
  static validateCreate(command: CreateTrustProfileCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (typeof command.score !== 'number' || Number.isNaN(command.score)) {
      throw new ValidationException('score must be a valid number');
    }
    if (!Object.values(TrustLevel).includes(command.level)) {
      throw new ValidationException(
        `level must be one of: ${Object.values(TrustLevel).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateTrustProfileCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.score !== undefined &&
      (typeof command.score !== 'number' || Number.isNaN(command.score))
    ) {
      throw new ValidationException('score must be a valid number');
    }
    if (
      command.level !== undefined &&
      !Object.values(TrustLevel).includes(command.level)
    ) {
      throw new ValidationException(
        `level must be one of: ${Object.values(TrustLevel).join(', ')}`,
      );
    }
    if (
      command.status !== undefined &&
      !Object.values(TrustStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(TrustStatus).join(', ')}`,
      );
    }
  }
}
