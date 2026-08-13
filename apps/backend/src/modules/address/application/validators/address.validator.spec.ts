import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { UpdateAddressCommand } from '../commands/update-address.command';
import { AddressValidator } from './address.validator';

describe('AddressValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

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
      latitude: number;
      longitude: number;
    }> = {},
  ): CreateAddressCommand {
    return new CreateAddressCommand(
      caller,
      overrides.identityId ?? 'identity-1',
      overrides.alias ?? 'Home',
      overrides.fullAddress ?? 'Calle 1 # 2-3',
      overrides.city ?? 'Bogotá',
      overrides.state ?? 'Cundinamarca',
      overrides.country ?? 'Colombia',
      overrides.postalCode ?? '110111',
      overrides.type ?? AddressType.Home,
      overrides.latitude,
      overrides.longitude,
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

    it('passes when both latitude and longitude are provided', () => {
      expect(() =>
        AddressValidator.validateCreate(
          validCommand({ latitude: 4.710989, longitude: -74.072092 }),
        ),
      ).not.toThrow();
    });

    it('passes when both latitude and longitude are omitted', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects latitude without longitude', () => {
      expect(() =>
        AddressValidator.validateCreate(validCommand({ latitude: 4.710989 })),
      ).toThrow(ValidationException);
    });

    it('rejects longitude without latitude', () => {
      expect(() =>
        AddressValidator.validateCreate(
          validCommand({ longitude: -74.072092 }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a latitude out of range', () => {
      expect(() =>
        AddressValidator.validateCreate(
          validCommand({ latitude: 91, longitude: 0 }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a longitude out of range', () => {
      expect(() =>
        AddressValidator.validateCreate(
          validCommand({ latitude: 0, longitude: -181 }),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
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
        AddressValidator.validateUpdate(new UpdateAddressCommand(caller, '  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank alias when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(caller, 'id-1', '  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank fullAddress when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(caller, 'id-1', undefined, '  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            'INVALID' as AddressStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('passes when latitude/longitude are both omitted (pin untouched)', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(caller, 'id-1'),
        ),
      ).not.toThrow();
    });

    it('passes when both latitude and longitude are provided', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            undefined,
            4.710989,
            -74.072092,
          ),
        ),
      ).not.toThrow();
    });

    it('passes when both latitude and longitude are explicitly null (pin cleared)', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            undefined,
            null,
            null,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects latitude provided without longitude', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            undefined,
            4.710989,
            undefined,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects latitude as a number while longitude is explicitly null', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            undefined,
            4.710989,
            null,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an out-of-range longitude', () => {
      expect(() =>
        AddressValidator.validateUpdate(
          new UpdateAddressCommand(
            caller,
            'id-1',
            undefined,
            undefined,
            undefined,
            0,
            200,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
