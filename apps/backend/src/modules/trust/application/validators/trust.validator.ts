import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';

/** Inclusive bounds a Trust `score` must fall within. `TrustScore`
 *  itself stays a pure wrapper, but "any number is a score" is not a
 *  usable contract: without bounds a caller could store a negative or
 *  arbitrarily large reputation. Exported so the HTTP DTOs document
 *  and enforce exactly the same range. */
export const MIN_TRUST_SCORE = 0;
export const MAX_TRUST_SCORE = 100;

/**
 * Structural validation for Trust commands — required fields,
 * well-formed values, and the `score` range above. Uniqueness (at most
 * one `Trust` per `Identity`) is a business rule enforced by
 * `CreateTrustProfileUseCase`, not structural validation.
 */
export class TrustValidator {
  /** Shared by create/update so both reject the same out-of-range values. */
  private static validateScore(score: number): void {
    if (typeof score !== 'number' || Number.isNaN(score)) {
      throw new ValidationException('score must be a valid number');
    }
    if (score < MIN_TRUST_SCORE || score > MAX_TRUST_SCORE) {
      throw new ValidationException(
        `score must be between ${MIN_TRUST_SCORE} and ${MAX_TRUST_SCORE}`,
      );
    }
  }

  static validateCreate(command: CreateTrustProfileCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    TrustValidator.validateScore(command.score);
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
    if (command.score !== undefined) {
      TrustValidator.validateScore(command.score);
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
