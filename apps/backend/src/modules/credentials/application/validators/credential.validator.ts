import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { UpdateCredentialCommand } from '../commands/update-credential.command';

/**
 * Structural validation for Credential commands — required fields,
 * well-formed values. No business rules beyond that (e.g. no
 * expiration policy — not documented in `credentials/README.md`, so
 * not invented here).
 */
export class CredentialValidator {
  static validateCreate(command: CreateCredentialCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!Object.values(CredentialType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(CredentialType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateCredentialCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.status !== undefined &&
      !Object.values(CredentialStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(CredentialStatus).join(', ')}`,
      );
    }
  }
}
