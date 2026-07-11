import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityCommand } from '../commands/create-identity.command';
import { UpdateIdentityCommand } from '../commands/update-identity.command';

/**
 * Structural validation for Identity commands — required fields,
 * well-formed values. No business rules (e.g. no age/uniqueness
 * checks — nothing in `identity/README.md` documents either as a
 * real invariant, so none are invented here).
 */
export class IdentityValidator {
  static validateCreate(command: CreateIdentityCommand): void {
    if (!command.fullName?.trim()) {
      throw new ValidationException('fullName is required');
    }
    if (!Object.values(DocumentType).includes(command.documentType)) {
      throw new ValidationException(
        `documentType must be one of: ${Object.values(DocumentType).join(', ')}`,
      );
    }
    if (!command.documentNumber?.trim()) {
      throw new ValidationException('documentNumber is required');
    }
    if (
      !(command.birthDate instanceof Date) ||
      Number.isNaN(command.birthDate.getTime())
    ) {
      throw new ValidationException('birthDate must be a valid date');
    }
  }

  static validateUpdate(command: UpdateIdentityCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.fullName !== undefined && !command.fullName.trim()) {
      throw new ValidationException('fullName cannot be blank');
    }
    if (
      command.status !== undefined &&
      !Object.values(IdentityStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(IdentityStatus).join(', ')}`,
      );
    }
  }
}
