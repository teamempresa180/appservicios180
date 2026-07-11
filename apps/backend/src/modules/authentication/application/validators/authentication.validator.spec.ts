import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationCommand } from '../commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../commands/update-authentication.command';
import { AuthenticationValidator } from './authentication.validator';

describe('AuthenticationValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AuthenticationValidator.validateCreate(
          new CreateAuthenticationCommand(
            'identity-1',
            AuthMethodType.Password,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        AuthenticationValidator.validateCreate(
          new CreateAuthenticationCommand('  ', AuthMethodType.Password),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid methodType', () => {
      expect(() =>
        AuthenticationValidator.validateCreate(
          new CreateAuthenticationCommand(
            'identity-1',
            'INVALID' as AuthMethodType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('rejects a blank id', () => {
      expect(() =>
        AuthenticationValidator.validateUpdate(
          new UpdateAuthenticationCommand('  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        AuthenticationValidator.validateUpdate(
          new UpdateAuthenticationCommand(
            'id-1',
            'INVALID' as AuthenticationStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('passes for a well-formed command', () => {
      expect(() =>
        AuthenticationValidator.validateUpdate(
          new UpdateAuthenticationCommand('id-1', AuthenticationStatus.Locked),
        ),
      ).not.toThrow();
    });
  });
});
