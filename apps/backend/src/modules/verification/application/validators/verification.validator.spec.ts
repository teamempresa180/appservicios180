import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationCommand } from '../commands/create-verification.command';
import { UpdateVerificationCommand } from '../commands/update-verification.command';
import { VerificationValidator } from './verification.validator';

describe('VerificationValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            VerificationType.Document,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand('  ', VerificationType.Document),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            'INVALID' as VerificationType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand('id-1', VerificationStatus.Approved),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand('  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand(
            'id-1',
            'INVALID' as VerificationStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
