import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class AttachmentDto {
  id!: string;
  messageId!: string;
  fileName!: string;
  mimeType!: string;
  fileSize!: number;
  type!: AttachmentType;
  status!: AttachmentStatus;
  createdAt!: Date;
}
