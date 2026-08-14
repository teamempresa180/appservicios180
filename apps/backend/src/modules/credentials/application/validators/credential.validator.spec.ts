import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { CreateCredentialCommand } from '../commands/create-credential.command';
import { UpdateCredentialCommand } from '../commands/update-credential.command';
import { CredentialValidator } from './credential.validator';

describe('CredentialValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed Password command', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            'identity-1',
            CredentialType.Password,
            'Str0ngPassw0rd!',
          ),
        ),
      ).not.toThrow();
    });

    it('passes for a well-formed non-Password command without a password', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            'identity-1',
            CredentialType.RecoveryCode,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            '  ',
            CredentialType.Password,
            'Str0ngPassw0rd!',
          ),
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

    it('rejects a Password credential without a password', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand('identity-1', CredentialType.Password),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a Password credential with a password shorter than 8 characters', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            'identity-1',
            CredentialType.Password,
            'short',
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a non-Password credential that includes a password', () => {
      expect(() =>
        CredentialValidator.validateCreate(
          new CreateCredentialCommand(
            'identity-1',
            CredentialType.RecoveryCode,
            'Str0ngPassw0rd!',
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('rejects a blank id', () => {
      expect(() =>
        CredentialValidator.validateUpdate(
          new UpdateCredentialCommand('  ', 'identity-1', Role.Customer),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        CredentialValidator.validateUpdate(
          new UpdateCredentialCommand(
            'id-1',
            'identity-1',
            Role.Customer,
            'INVALID' as CredentialStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('passes for a well-formed command', () => {
      expect(() =>
        CredentialValidator.validateUpdate(
          new UpdateCredentialCommand(
            'id-1',
            'identity-1',
            Role.Customer,
            CredentialStatus.Expired,
          ),
        ),
      ).not.toThrow();
    });
  });

  describe('validateChangePassword', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        CredentialValidator.validateChangePassword(
          new ChangePasswordCommand('id-1', 'OldPassw0rd!', 'NewPassw0rd!'),
        ),
      ).not.toThrow();
    });

    it('rejects a blank credentialId', () => {
      expect(() =>
        CredentialValidator.validateChangePassword(
          new ChangePasswordCommand('  ', 'OldPassw0rd!', 'NewPassw0rd!'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a missing currentPassword', () => {
      expect(() =>
        CredentialValidator.validateChangePassword(
          new ChangePasswordCommand('id-1', '', 'NewPassw0rd!'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a newPassword shorter than 8 characters', () => {
      expect(() =>
        CredentialValidator.validateChangePassword(
          new ChangePasswordCommand('id-1', 'OldPassw0rd!', 'short'),
        ),
      ).toThrow(ValidationException);
    });
  });
});
