import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { CreateProviderCommand } from '../commands/create-provider.command';
import { UpdateProviderCommand } from '../commands/update-provider.command';
import { ProviderValidator } from './provider.validator';

describe('ProviderValidator', () => {
  function validCommand(
    overrides: Partial<{
      identityId: string;
      providerProfileId: string;
      yearsOfExperience: number;
    }> = {},
  ): CreateProviderCommand {
    return new CreateProviderCommand(
      overrides.identityId ?? 'identity-1',
      overrides.providerProfileId ?? 'profile-1',
      ProviderType.Independent,
      ProviderExperience.Intermediate,
      'bio',
      overrides.yearsOfExperience ?? 5,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ProviderValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        ProviderValidator.validateCreate(validCommand({ identityId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank providerProfileId', () => {
      expect(() =>
        ProviderValidator.validateCreate(
          validCommand({ providerProfileId: '  ' }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a negative yearsOfExperience', () => {
      expect(() =>
        ProviderValidator.validateCreate(
          validCommand({ yearsOfExperience: -1 }),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ProviderValidator.validateUpdate(
          new UpdateProviderCommand(
            'id-1',
            'New bio',
            ProviderExperience.Expert,
            ProviderStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ProviderValidator.validateUpdate(new UpdateProviderCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ProviderValidator.validateUpdate(
          new UpdateProviderCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as ProviderStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
