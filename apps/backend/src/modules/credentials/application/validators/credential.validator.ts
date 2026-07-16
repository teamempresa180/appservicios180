import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { UpdateCredentialCommand } from '../commands/update-credential.command';

const MIN_PASSWORD_LENGTH = 8;

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
    if (command.type === CredentialType.Password) {
      if (!command.password || command.password.length < MIN_PASSWORD_LENGTH) {
        throw new ValidationException(
          `password is required and must be at least ${MIN_PASSWORD_LENGTH} characters for a ${CredentialType.Password} credential`,
        );
      }
    } else if (command.password !== undefined) {
      throw new ValidationException(
        `password is only accepted for a ${CredentialType.Password} credential`,
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

  static validateChangePassword(command: ChangePasswordCommand): void {
    if (!command.credentialId?.trim()) {
      throw new ValidationException('credentialId is required');
    }
    if (!command.currentPassword) {
      throw new ValidationException('currentPassword is required');
    }
    if (
      !command.newPassword ||
      command.newPassword.length < MIN_PASSWORD_LENGTH
    ) {
      throw new ValidationException(
        `newPassword is required and must be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
    }
  }
}
