import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { UpdateCredentialCommand } from '../commands/update-credential.command';
import { CredentialValidator } from './credential.validator';

describe('CredentialValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand('identity-1', CredentialType.Password),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand('  ', CredentialType.Password),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            'identity-1',
            'INVALID' as CredentialType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('rejects a blank id', () => {
      expect(() =>
        CredentialValidator.validateUpdate(new UpdateCredentialCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        CredentialValidator.validateUpdate(
          new UpdateCredentialCommand('id-1', 'INVALID' as CredentialStatus),
        ),
      ).toThrow(ValidationException);
    });

    it('passes for a well-formed command', () => {
      expect(() =>
        CredentialValidator.validateUpdate(
          new UpdateCredentialCommand('id-1', CredentialStatus.Expired),
        ),
      ).not.toThrow();
    });
  });
});
