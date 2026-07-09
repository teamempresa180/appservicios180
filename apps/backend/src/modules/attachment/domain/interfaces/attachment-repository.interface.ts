import { Attachment } from '../entities/attachment.entity';
import { AttachmentId } from '../value-objects/attachment-id.value-object';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';

/**
 * Contract for Attachment persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface AttachmentRepository {
  findById(id: AttachmentId): Promise<Attachment | null>;
  findByMessageId(messageId: MessageId): Promise<Attachment[]>;
  save(attachment: Attachment): Promise<void>;
}
