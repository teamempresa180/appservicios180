import { PaginatedResult } from '../../../../core/application/paginated-result';
import { MessageId } from '../../../../message/domain/value-objects/message-id.value-object';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Attachment } from '../../../domain/entities/attachment.entity';
import { AttachmentRepository } from '../../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../../domain/value-objects/attachment-id.value-object';

/**
 * In-memory `AttachmentRepository` fake — see
 * `InMemoryIdentityRepository`.
 *
 * The real repository derives an Attachment's audience by walking
 * message → chat → participants. There are no Messages or Chats here,
 * so that relation is modelled directly: `registerParticipants` maps a
 * `messageId` to the Identity ids that may see its Attachments, and
 * everything scoped reads through it. A Message with no registered
 * participants is visible to nobody, which mirrors production — an
 * Attachment whose chat you are not in is not yours to see.
 */
export class InMemoryAttachmentRepository implements AttachmentRepository {
  private readonly rows = new Map<string, Attachment>();
  private readonly participantsByMessageId = new Map<string, string[]>();

  /** Test seam: declare who takes part in the Chat behind a Message. */
  registerParticipants(messageId: string, identityIds: string[]): void {
    this.participantsByMessageId.set(messageId, identityIds);
  }

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

  list(
    page: number,
    pageSize: number,
    participantIdentityId?: IdentityId,
  ): Promise<PaginatedResult<Attachment>> {
    const all = [...this.rows.values()].filter((row) =>
      this.isVisibleTo(row, participantIdentityId),
    );
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(
    term: string,
    participantIdentityId?: IdentityId,
  ): Promise<Attachment[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          this.isVisibleTo(row, participantIdentityId) &&
          row.fileName.toLowerCase().includes(lower),
      ),
    );
  }

  findParticipantIdentityIds(id: AttachmentId): Promise<string[]> {
    const attachment = this.rows.get(id.value);
    if (!attachment) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      this.participantsByMessageId.get(attachment.messageId.value) ?? [],
    );
  }

  private isVisibleTo(
    attachment: Attachment,
    participantIdentityId?: IdentityId,
  ): boolean {
    if (participantIdentityId === undefined) {
      return true;
    }
    const participants =
      this.participantsByMessageId.get(attachment.messageId.value) ?? [];
    return participants.includes(participantIdentityId.value);
  }
}
