import { AttachmentModel as PrismaAttachment } from '@prisma/client';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../domain/entities/attachment.entity';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { AttachmentPrismaMapper } from './attachment-prisma.mapper';

describe('AttachmentPrismaMapper', () => {
  const row: PrismaAttachment = {
    id: 'id-1',
    messageId: 'message-1',
    fileName: 'photo.jpg',
    mimeType: 'image/jpeg',
    fileSize: 2048,
    type: 'IMAGE',
    status: 'AVAILABLE',
    createdAt: new Date('2024-01-01'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const attachment = AttachmentPrismaMapper.toDomain(row);

    expect(attachment.id.value).toBe('id-1');
    expect(attachment.messageId.value).toBe('message-1');
    expect(attachment.status).toBe(AttachmentStatus.Available);
    expect(attachment.type).toBe(AttachmentType.Image);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const attachment = new Attachment(AttachmentId.fromString('id-1'), {
      messageId: MessageId.fromString('message-1'),
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 2048,
      type: AttachmentType.Image,
      status: AttachmentStatus.Available,
      createdAt: new Date('2024-01-01'),
    });

    expect(AttachmentPrismaMapper.toPersistence(attachment)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const attachment = AttachmentPrismaMapper.toDomain(row);
    expect(AttachmentPrismaMapper.toPersistence(attachment)).toEqual(row);
  });
});
