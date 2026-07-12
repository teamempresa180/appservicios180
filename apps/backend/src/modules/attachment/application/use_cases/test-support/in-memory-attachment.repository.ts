import { PaginatedResult } from '../../../../core/application/paginated-result';
import { MessageId } from '../../../../message/domain/value-objects/message-id.value-object';
import { Attachment } from '../../../domain/entities/attachment.entity';
import { AttachmentRepository } from '../../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../../domain/value-objects/attachment-id.value-object';

/** In-memory `AttachmentRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryAttachmentRepository implements AttachmentRepository {
  private readonly rows = new Map<string, Attachment>();

  findById(id: AttachmentId): Promise<Attachment | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByMessageId(messageId: MessageId): Promise<Attachment[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.messageId.equals(messageId)),
    );
  }

  save(attachment: Attachment): Promise<void> {
    this.rows.set(attachment.id.value, attachment);
    return Promise.resolve();
  }

  delete(id: AttachmentId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Attachment>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Attachment[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.fileName.toLowerCase().includes(lower),
      ),
    );
  }
}
