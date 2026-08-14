import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { UpdateContactCommand } from '../commands/update-contact.command';
import { ContactValidator } from './contact.validator';

describe('ContactValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  describe('validateValueForType', () => {
    it('accepts a well-formed email for ContactType.Email', () => {
      expect(() =>
        ContactValidator.validateValueForType(
          ContactType.Email,
          'jane.doe@example.com',
        ),
      ).not.toThrow();
    });

    it('rejects a value without an @ for ContactType.Email', () => {
      expect(() =>
        ContactValidator.validateValueForType(ContactType.Email, 'jane.doe'),
      ).toThrow(ValidationException);
    });

    it.each(['+57 300 123 4567', '3001234567', '(601) 555-0001'])(
      'accepts %s for ContactType.Phone',
      (value) => {
        expect(() =>
          ContactValidator.validateValueForType(ContactType.Phone, value),
        ).not.toThrow();
      },
    );

    it.each(['12345', 'not-a-phone', '+'])(
      'rejects %s for ContactType.Phone',
      (value) => {
        expect(() =>
          ContactValidator.validateValueForType(ContactType.Phone, value),
        ).toThrow(ValidationException);
      },
    );

    it('accepts any value for ContactType.Other', () => {
      expect(() =>
        ContactValidator.validateValueForType(ContactType.Other, 'ext-4417'),
      ).not.toThrow();
    });
  });

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand(
            caller,
            'identity-1',
            ContactType.Email,
            'a@b.com',
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand(caller, '  ', ContactType.Email, 'a@b.com'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand(
            caller,
            'identity-1',
            'INVALID' as ContactType,
            'a@b.com',
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank value', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand(
            caller,
            'identity-1',
            ContactType.Email,
            '  ',
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ContactValidator.validateUpdate(
          new UpdateContactCommand(
            caller,
            'id-1',
            'a@b.com',
            ContactStatus.Active,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ContactValidator.validateUpdate(new UpdateContactCommand(caller, '  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank value when provided', () => {
      expect(() =>
        ContactValidator.validateUpdate(
          new UpdateContactCommand(caller, 'id-1', '  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ContactValidator.validateUpdate(
          new UpdateContactCommand(
            caller,
            'id-1',
            undefined,
            'INVALID' as ContactStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
