import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleCommand } from '../commands/create-schedule.command';
import { UpdateScheduleCommand } from '../commands/update-schedule.command';
import { ScheduleValidator } from './schedule.validator';

describe('ScheduleValidator', () => {
  function validCommand(
    overrides: Partial<{ providerId: string }> = {},
  ): CreateScheduleCommand {
    return new CreateScheduleCommand(
      overrides.providerId ?? 'provider-1',
      new Date('2026-01-01T08:00:00Z'),
      new Date('2026-01-01T09:00:00Z'),
      ScheduleType.Regular,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ScheduleValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank providerId', () => {
      expect(() =>
        ScheduleValidator.validateCreate(validCommand({ providerId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects startDateTime after endDateTime', () => {
      expect(() =>
        ScheduleValidator.validateCreate(
          new CreateScheduleCommand(
            'provider-1',
            new Date('2026-01-01T09:00:00Z'),
            new Date('2026-01-01T08:00:00Z'),
            ScheduleType.Regular,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        ScheduleValidator.validateCreate(
          new CreateScheduleCommand(
            'provider-1',
            new Date('2026-01-01T08:00:00Z'),
            new Date('2026-01-01T09:00:00Z'),
            'INVALID' as ScheduleType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ScheduleValidator.validateUpdate(
          new UpdateScheduleCommand(
            'id-1',
            undefined,
            undefined,
            ScheduleStatus.Blocked,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ScheduleValidator.validateUpdate(new UpdateScheduleCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ScheduleValidator.validateUpdate(
          new UpdateScheduleCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as ScheduleStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
