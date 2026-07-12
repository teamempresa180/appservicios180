import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceCommand } from '../commands/create-service.command';
import { UpdateServiceCommand } from '../commands/update-service.command';
import { ServiceValidator } from './service.validator';

describe('ServiceValidator', () => {
  function validCommand(
    overrides: Partial<{
      providerId: string;
      categoryId: string;
      name: string;
      basePrice: number;
      estimatedDuration: number;
      type: ServiceType;
    }> = {},
  ): CreateServiceCommand {
    return new CreateServiceCommand(
      overrides.providerId ?? 'provider-1',
      overrides.categoryId ?? 'category-1',
      overrides.name ?? 'Pipe Repair',
      'desc',
      overrides.basePrice ?? 50,
      overrides.estimatedDuration ?? 60,
      overrides.type ?? ServiceType.Standard,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ServiceValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank providerId', () => {
      expect(() =>
        ServiceValidator.validateCreate(validCommand({ providerId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank categoryId', () => {
      expect(() =>
        ServiceValidator.validateCreate(validCommand({ categoryId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a negative basePrice', () => {
      expect(() =>
        ServiceValidator.validateCreate(validCommand({ basePrice: -5 })),
      ).toThrow(ValidationException);
    });

    it('rejects a negative estimatedDuration', () => {
      expect(() =>
        ServiceValidator.validateCreate(
          validCommand({ estimatedDuration: -1 }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        ServiceValidator.validateCreate(
          validCommand({ type: 'INVALID' as ServiceType }),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ServiceValidator.validateUpdate(
          new UpdateServiceCommand('id-1', 75, 90, ServiceStatus.Active),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ServiceValidator.validateUpdate(new UpdateServiceCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a negative basePrice when provided', () => {
      expect(() =>
        ServiceValidator.validateUpdate(new UpdateServiceCommand('id-1', -1)),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ServiceValidator.validateUpdate(
          new UpdateServiceCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as ServiceStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
