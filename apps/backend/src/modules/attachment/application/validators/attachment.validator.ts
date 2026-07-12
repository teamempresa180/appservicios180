import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { CreateAttachmentCommand } from '../commands/create-attachment.command';

/**
 * Structural validation for Attachment commands — required fields,
 * well-formed values. No `validateUpdate`: no
 * `UpdateAttachmentCommand` exists in the skeleton, only
 * Create/Delete.
 */
export class AttachmentValidator {
  static validateCreate(command: CreateAttachmentCommand): void {
    if (!command.messageId?.trim()) {
      throw new ValidationException('messageId is required');
    }
    if (!command.fileName?.trim()) {
      throw new ValidationException('fileName is required');
    }
    if (!command.mimeType?.trim()) {
      throw new ValidationException('mimeType is required');
    }
    if (
      typeof command.fileSize !== 'number' ||
      Number.isNaN(command.fileSize) ||
      command.fileSize <= 0
    ) {
      throw new ValidationException('fileSize must be a positive number');
    }
    if (!Object.values(AttachmentType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(AttachmentType).join(', ')}`,
      );
    }
  }
}
