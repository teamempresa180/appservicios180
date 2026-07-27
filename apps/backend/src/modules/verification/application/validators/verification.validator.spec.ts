import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationCommand } from '../commands/create-verification.command';
import { UpdateVerificationCommand } from '../commands/update-verification.command';
import { UploadVerificationDocumentCommand } from '../commands/upload-verification-document.command';
import { VerificationValidator } from './verification.validator';

describe('VerificationValidator', () => {
  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            VerificationType.Document,
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand('  ', VerificationType.Document),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            'INVALID' as VerificationType,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('accepts the CriminalRecord and Certification types', () => {
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            VerificationType.CriminalRecord,
          ),
        ),
      ).not.toThrow();
      expect(() =>
        VerificationValidator.validateCreate(
          new CreateVerificationCommand(
            'identity-1',
            VerificationType.Certification,
          ),
        ),
      ).not.toThrow();
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand('id-1', VerificationStatus.Approved),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand('  '),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        VerificationValidator.validateUpdate(
          new UpdateVerificationCommand(
            'id-1',
            'INVALID' as VerificationStatus,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUploadDocument', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        VerificationValidator.validateUploadDocument(
          new UploadVerificationDocumentCommand(
            'id-1',
            'uploads/verifications/id-1/record.pdf',
          ),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        VerificationValidator.validateUploadDocument(
          new UploadVerificationDocumentCommand('  ', 'uploads/x/file.pdf'),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank documentPath', () => {
      expect(() =>
        VerificationValidator.validateUploadDocument(
          new UploadVerificationDocumentCommand('id-1', '  '),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateDocumentMimeType', () => {
    it.each(['application/pdf', 'image/png', 'image/jpeg'])(
      'accepts %s',
      (mimetype) => {
        expect(() =>
          VerificationValidator.validateDocumentMimeType(mimetype),
        ).not.toThrow();
      },
    );

    it('rejects an unsupported mimetype', () => {
      expect(() =>
        VerificationValidator.validateDocumentMimeType('text/plain'),
      ).toThrow(ValidationException);
    });

    it('rejects an undefined mimetype', () => {
      expect(() =>
        VerificationValidator.validateDocumentMimeType(undefined),
      ).toThrow(ValidationException);
    });
  });
});
