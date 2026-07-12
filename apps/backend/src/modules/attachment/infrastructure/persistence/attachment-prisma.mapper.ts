import { AttachmentModel as PrismaAttachment } from '@prisma/client';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * Translates between the `Attachment` domain entity and its Prisma
 * row shape (`AttachmentModel`, mapped to the `attachments` table).
 * The only place in this module that imports from `@prisma/client` —
 * Domain/Application never do.
 */
export class AttachmentPrismaMapper {
  static toDomain(row: PrismaAttachment): Attachment {
    return new Attachment(AttachmentId.fromString(row.id), {
      messageId: MessageId.fromString(row.messageId),
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileSize: row.fileSize,
      type: row.type as unknown as AttachmentType,
      status: row.status as unknown as AttachmentStatus,
      createdAt: row.createdAt,
    });
  }

  static toPersistence(attachment: Attachment): PrismaAttachment {
    return {
      id: attachment.id.value,
      messageId: attachment.messageId.value,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,
      type: attachment.type,
      status: attachment.status,
      createdAt: attachment.createdAt,
    };
  }
}
