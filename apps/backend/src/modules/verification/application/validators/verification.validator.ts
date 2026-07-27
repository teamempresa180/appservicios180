import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationCommand } from '../commands/create-verification.command';
import { UpdateVerificationCommand } from '../commands/update-verification.command';
import { UploadVerificationDocumentCommand } from '../commands/upload-verification-document.command';

/** Mimetypes accepted for a Verification document upload — kept next to
 *  the validator (not the controller) so both the HTTP layer and any
 *  future caller of `UploadVerificationDocumentUseCase` enforce the
 *  same allow-list. */
export const ALLOWED_VERIFICATION_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const;

/**
 * Structural validation for Verification commands — required fields,
 * well-formed values. No business rules (e.g. no uniqueness-per-Identity
 * check — the repository contract's `findByIdentityId` returns
 * `Verification[]`, so multiple verifications per Identity are
 * allowed, e.g. one per `VerificationType`).
 */
export class VerificationValidator {
  static validateCreate(command: CreateVerificationCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!Object.values(VerificationType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(VerificationType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateVerificationCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.status !== undefined &&
      !Object.values(VerificationStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(VerificationStatus).join(', ')}`,
      );
    }
  }

  static validateUploadDocument(
    command: UploadVerificationDocumentCommand,
  ): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (!command.documentPath?.trim()) {
      throw new ValidationException('documentPath is required');
    }
  }

  /** Rejects any mimetype outside `ALLOWED_VERIFICATION_DOCUMENT_MIME_TYPES`
   *  — called before the file is written to disk, so an invalid upload
   *  never reaches the filesystem. */
  static validateDocumentMimeType(mimetype: string | undefined): void {
    if (
      !mimetype ||
      !(ALLOWED_VERIFICATION_DOCUMENT_MIME_TYPES as readonly string[]).includes(
        mimetype,
      )
    ) {
      throw new ValidationException(
        `file must be one of: ${ALLOWED_VERIFICATION_DOCUMENT_MIME_TYPES.join(', ')}`,
      );
    }
  }
}
