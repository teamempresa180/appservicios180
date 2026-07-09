import { Attachment } from './attachment.entity';
import { AttachmentId } from '../value-objects/attachment-id.value-object';
import { AttachmentType } from '../value-objects/attachment-type.value-object';
import { AttachmentStatus } from '../value-objects/attachment-status.value-object';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';

describe('Attachment', () => {
  it('holds all the assigned properties', () => {
    const id = AttachmentId.create();
    const messageId = MessageId.create();
    const now = new Date();
    const attachment = new Attachment(id, {
      messageId,
      fileName: 'factura.pdf',
      mimeType: 'application/pdf',
      fileSize: 204800,
      type: AttachmentType.Document,
      status: AttachmentStatus.Available,
      createdAt: now,
    });

    expect(attachment.id).toBe(id);
    expect(attachment.messageId).toBe(messageId);
    expect(attachment.fileName).toBe('factura.pdf');
    expect(attachment.mimeType).toBe('application/pdf');
    expect(attachment.fileSize).toBe(204800);
    expect(attachment.type).toBe(AttachmentType.Document);
    expect(attachment.status).toBe(AttachmentStatus.Available);
  });

  it('is equal to another attachment with the same id', () => {
    const id = AttachmentId.create();
    const messageId = MessageId.create();
    const now = new Date();
    const props = {
      messageId,
      fileName: 'foto.jpg',
      mimeType: 'image/jpeg',
      fileSize: 102400,
      type: AttachmentType.Image,
      status: AttachmentStatus.Pending,
      createdAt: now,
    };
    const a = new Attachment(id, props);
    const b = new Attachment(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
