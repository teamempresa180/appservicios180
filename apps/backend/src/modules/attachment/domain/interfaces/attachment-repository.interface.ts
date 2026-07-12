import { PaginatedResult } from '../../../core/application/paginated-result';
import { Attachment } from '../entities/attachment.entity';
import { AttachmentId } from '../value-objects/attachment-id.value-object';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';

/**
 * Contract for Attachment persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 10: `PrismaAttachmentRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `AttachmentRepository` implementation by
 *  contract instead of by concrete class. */
export const ATTACHMENT_REPOSITORY = Symbol('AttachmentRepository');

export interface AttachmentRepository {
  findById(id: AttachmentId): Promise<Attachment | null>;
  findByMessageId(messageId: MessageId): Promise<Attachment[]>;
  save(attachment: Attachment): Promise<void>;
  delete(id: AttachmentId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Attachment>>;
  /** Free-text match against `fileName`. */
  search(term: string): Promise<Attachment[]>;
}
