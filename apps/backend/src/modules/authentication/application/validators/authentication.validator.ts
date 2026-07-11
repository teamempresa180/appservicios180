import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationCommand } from '../commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../commands/update-authentication.command';

/**
 * Structural validation for Authentication commands — required
 * fields, well-formed values. No business rules beyond that (e.g. no
 * "one active password per Identity" limit — not documented in
 * `authentication/README.md`, so not invented here).
 */
export class AuthenticationValidator {
  static validateCreate(command: CreateAuthenticationCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!Object.values(AuthMethodType).includes(command.methodType)) {
      throw new ValidationException(
        `methodType must be one of: ${Object.values(AuthMethodType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateAuthenticationCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.status !== undefined &&
      !Object.values(AuthenticationStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(AuthenticationStatus).join(', ')}`,
      );
    }
  }
}
