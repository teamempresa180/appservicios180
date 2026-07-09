import { Entity } from '../../../core/domain/base/entity.base';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { AttachmentId } from '../value-objects/attachment-id.value-object';
import { AttachmentType } from '../value-objects/attachment-type.value-object';
import { AttachmentStatus } from '../value-objects/attachment-status.value-object';

export interface AttachmentProps {
  messageId: MessageId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  type: AttachmentType;
  status: AttachmentStatus;
  createdAt: Date;
}

/**
 * Represents a file attached to a Message.
 * Pure data holder — no storage provider, no upload/download, no
 * compression, no OCR, no AI, no antivirus, no persistence, no business rules.
 */
export class Attachment extends Entity<AttachmentId> {
  public readonly messageId: MessageId;
  public readonly fileName: string;
  public readonly mimeType: string;
  public readonly fileSize: number;
  public readonly type: AttachmentType;
  public readonly status: AttachmentStatus;
  public readonly createdAt: Date;

  constructor(id: AttachmentId, props: AttachmentProps) {
    super(id);
    this.messageId = props.messageId;
    this.fileName = props.fileName;
    this.mimeType = props.mimeType;
    this.fileSize = props.fileSize;
    this.type = props.type;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}
