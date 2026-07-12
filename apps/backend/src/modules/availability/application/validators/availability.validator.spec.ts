import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityCommand } from '../commands/create-availability.command';
import { UpdateAvailabilityCommand } from '../commands/update-availability.command';
import { AvailabilityValidator } from './availability.validator';

describe('AvailabilityValidator', () => {
  function validCommand(
    overrides: Partial<{ providerId: string }> = {},
  ): CreateAvailabilityCommand {
    return new CreateAvailabilityCommand(
      overrides.providerId ?? 'provider-1',
      AvailabilityType.FullTime,
      new Date('2026-01-01T08:00:00Z'),
      new Date('2026-01-01T17:00:00Z'),
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AvailabilityValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank providerId', () => {
      expect(() =>
        AvailabilityValidator.validateCreate(
          validCommand({ providerId: '  ' }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects availableFrom after availableTo', () => {
      expect(() =>
        AvailabilityValidator.validateCreate(
          new CreateAvailabilityCommand(
            'provider-1',
            AvailabilityType.FullTime,
            new Date('2026-01-01T17:00:00Z'),
            new Date('2026-01-01T08:00:00Z'),
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        AvailabilityValidator.validateCreate(
          new CreateAvailabilityCommand(
            'provider-1',
            'INVALID' as AvailabilityType,
            new Date('2026-01-01T08:00:00Z'),
            new Date('2026-01-01T17:00:00Z'),
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AvailabilityValidator.validateUpdate(
          new UpdateAvailabilityCommand(
            'id-1',
            undefined,
            undefined,
            AvailabilityStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        AvailabilityValidator.validateUpdate(
          new UpdateAvailabilityCommand('  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        AvailabilityValidator.validateUpdate(
          new UpdateAvailabilityCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as AvailabilityStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
