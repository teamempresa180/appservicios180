import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { CreateAuditRecordCommand } from '../commands/create-audit-record.command';
import { AuditValidator } from './audit.validator';

describe('AuditValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AuditValidator.validateCreate(
          new CreateAuditRecordCommand(
            caller,
            'identity-1',
            AuditActionType.Created,
            'Something happened',
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        AuditValidator.validateCreate(
          new CreateAuditRecordCommand(
            caller,
            '  ',
            AuditActionType.Created,
            'Something happened',
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid actionType', () => {
      expect(() =>
        AuditValidator.validateCreate(
          new CreateAuditRecordCommand(
            caller,
            'identity-1',
            'INVALID' as AuditActionType,
            'Something happened',
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank description', () => {
      expect(() =>
        AuditValidator.validateCreate(
          new CreateAuditRecordCommand(
            caller,
            'identity-1',
            AuditActionType.Created,
            '  ',
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
