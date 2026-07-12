import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { CreateAuditRecordCommand } from '../commands/create-audit-record.command';

/**
 * Structural validation for Audit commands — required fields,
 * well-formed values. Only `validateCreate` exists: audit records are
 * immutable by design (see `CreateAuditRecordCommand`), so there is no
 * update command to validate.
 */
export class AuditValidator {
  static validateCreate(command: CreateAuditRecordCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!Object.values(AuditActionType).includes(command.actionType)) {
      throw new ValidationException(
        `actionType must be one of: ${Object.values(AuditActionType).join(', ')}`,
      );
    }
    if (!command.description?.trim()) {
      throw new ValidationException('description is required');
    }
  }
}
