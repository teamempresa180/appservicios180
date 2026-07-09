import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * Input shape for creating an Attachment. No validation.
 */
export class CreateAttachmentDto {
  messageId!: string;
  fileName!: string;
  mimeType!: string;
  fileSize!: number;
  type!: AttachmentType;
}
