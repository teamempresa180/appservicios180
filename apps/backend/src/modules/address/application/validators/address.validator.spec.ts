import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { UpdateAddressCommand } from '../commands/update-address.command';
import { AddressValidator } from './address.validator';

describe('AddressValidator', () => {
  function validCommand(
    overrides: Partial<{
      identityId: string;
      alias: string;
      fullAddress: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      type: AddressType;
    }> = {},
  ): CreateAddressCommand {
    return new CreateAddressCommand(
      overrides.identityId ?? 'identity-1',
      overrides.alias ?? 'Home',
      overrides.fullAddress ?? 'Calle 1 # 2-3',
      overrides.city ?? 'Bogotá',
      overrides.state ?? 'Cundinamarca',
      overrides.country ?? 'Colombia',
      overrides.postalCode ?? '110111',
      overrides.type ?? AddressType.Home,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ identityId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank alias', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ alias: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank fullAddress', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ fullAddress: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank city', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ city: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank state', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ state: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank country', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ country: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank postalCode', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ postalCode: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        AddressValidator.validateCreate(
          validCommand({ type: 'INVALID' as AddressType }),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            'id-1',
            'Work',
            'Carrera 9',
            AddressStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        AddressValidator.validateUpdate(new UpdateAddressCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank alias when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(new UpdateAddressCommand('id-1', '  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank fullAddress when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand('id-1', undefined, '  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            'id-1',
            undefined,
            undefined,
            'INVALID' as AddressStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
