import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileCommand } from '../commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../commands/update-trust-profile.command';
import { TrustValidator } from './trust.validator';

describe('TrustValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        TrustValidator.validateCreate(
          new CreateTrustProfileCommand('identity-1', 75, TrustLevel.High),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        TrustValidator.validateCreate(
          new CreateTrustProfileCommand('  ', 75, TrustLevel.High),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a NaN score', () => {
      expect(() =>
        TrustValidator.validateCreate(
          new CreateTrustProfileCommand(
            'identity-1',
            Number.NaN,
            TrustLevel.High,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid level', () => {
      expect(() =>
        TrustValidator.validateCreate(
          new CreateTrustProfileCommand(
            'identity-1',
            75,
            'INVALID' as TrustLevel,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        TrustValidator.validateUpdate(
          new UpdateTrustProfileCommand(
            'id-1',
            90,
            TrustLevel.VeryHigh,
            TrustStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        TrustValidator.validateUpdate(new UpdateTrustProfileCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a NaN score when provided', () => {
      expect(() =>
        TrustValidator.validateUpdate(
          new UpdateTrustProfileCommand('id-1', Number.NaN),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid level when provided', () => {
      expect(() =>
        TrustValidator.validateUpdate(
          new UpdateTrustProfileCommand(
            'id-1',
            undefined,
            'INVALID' as TrustLevel,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        TrustValidator.validateUpdate(
          new UpdateTrustProfileCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as TrustStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
