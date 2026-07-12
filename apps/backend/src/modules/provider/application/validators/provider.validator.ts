import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { CreateProviderCommand } from '../commands/create-provider.command';
import { UpdateProviderCommand } from '../commands/update-provider.command';

/**
 * Structural validation for Provider commands — required fields,
 * well-formed values. Uniqueness (at most one `Provider` per
 * `Identity`) is a business rule enforced by `CreateProviderUseCase`,
 * not structural validation, same criterion as `TrustValidator`.
 */
export class ProviderValidator {
  static validateCreate(command: CreateProviderCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!command.providerProfileId?.trim()) {
      throw new ValidationException('providerProfileId is required');
    }
    if (!Object.values(ProviderType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(ProviderType).join(', ')}`,
      );
    }
    if (!Object.values(ProviderExperience).includes(command.experience)) {
      throw new ValidationException(
        `experience must be one of: ${Object.values(ProviderExperience).join(', ')}`,
      );
    }
    if (!command.biography?.trim()) {
      throw new ValidationException('biography is required');
    }
    if (
      typeof command.yearsOfExperience !== 'number' ||
      Number.isNaN(command.yearsOfExperience) ||
      command.yearsOfExperience < 0
    ) {
      throw new ValidationException(
        'yearsOfExperience must be a non-negative number',
      );
    }
  }

  static validateUpdate(command: UpdateProviderCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.biography !== undefined && !command.biography.trim()) {
      throw new ValidationException('biography cannot be blank');
    }
    if (
      command.experience !== undefined &&
      !Object.values(ProviderExperience).includes(command.experience)
    ) {
      throw new ValidationException(
        `experience must be one of: ${Object.values(ProviderExperience).join(', ')}`,
      );
    }
    if (
      command.status !== undefined &&
      !Object.values(ProviderStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(ProviderStatus).join(', ')}`,
      );
    }
  }
}
