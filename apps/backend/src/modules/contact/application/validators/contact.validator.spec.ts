import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { UpdateContactCommand } from '../commands/update-contact.command';
import { ContactValidator } from './contact.validator';

describe('ContactValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand('identity-1', ContactType.Email, 'a@b.com'),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand('  ', ContactType.Email, 'a@b.com'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        ContactValidator.validateCreate(
          new CreateContactCommand(
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
          new CreateContactCommand('identity-1', ContactType.Email, '  '),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ContactValidator.validateUpdate(
          new UpdateContactCommand('id-1', 'a@b.com', ContactStatus.Active),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ContactValidator.validateUpdate(new UpdateContactCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank value when provided', () => {
      expect(() =>
        ContactValidator.validateUpdate(new UpdateContactCommand('id-1', '  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        ContactValidator.validateUpdate(
          new UpdateContactCommand(
            'id-1',
            undefined,
            'INVALID' as ContactStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
