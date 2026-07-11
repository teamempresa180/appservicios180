import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityCommand } from '../commands/create-identity.command';
import { UpdateIdentityCommand } from '../commands/update-identity.command';
import { IdentityValidator } from './identity.validator';

describe('IdentityValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        IdentityValidator.validateCreate(
          new CreateIdentityCommand(
            'Ana',
            DocumentType.NationalId,
            '123',
            new Date(),
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank fullName', () => {
      expect(() =>
        IdentityValidator.validateCreate(
          new CreateIdentityCommand(
            '   ',
            DocumentType.NationalId,
            '123',
            new Date(),
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid documentType', () => {
      expect(() =>
        IdentityValidator.validateCreate(
          new CreateIdentityCommand(
            'Ana',
            'INVALID' as DocumentType,
            '123',
            new Date(),
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank documentNumber', () => {
      expect(() =>
        IdentityValidator.validateCreate(
          new CreateIdentityCommand(
            'Ana',
            DocumentType.NationalId,
            '  ',
            new Date(),
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid birthDate', () => {
      expect(() =>
        IdentityValidator.validateCreate(
          new CreateIdentityCommand(
            'Ana',
            DocumentType.NationalId,
            '123',
            new Date('not-a-date'),
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        IdentityValidator.validateUpdate(
          new UpdateIdentityCommand('id-1', 'New Name', IdentityStatus.Active),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        IdentityValidator.validateUpdate(new UpdateIdentityCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank fullName when provided', () => {
      expect(() =>
        IdentityValidator.validateUpdate(
          new UpdateIdentityCommand('id-1', '   '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        IdentityValidator.validateUpdate(
          new UpdateIdentityCommand(
            'id-1',
            undefined,
            'INVALID' as IdentityStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
