import { PaginatedResult } from '../../../core/application/paginated-result';
import { Attachment } from '../entities/attachment.entity';
import { AttachmentId } from '../value-objects/attachment-id.value-object';
import { MessageId } from '../../../message/domain/value-objects/message-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Attachment persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 10: `PrismaAttachmentRepository`).
 *
 * An Attachment has no `identityId` of its own: it hangs off a
 * Message, which hangs off a Chat, which has exactly two participants
 * (the client Identity and the provider's Identity). Visibility is
 * therefore expressed as *participation*, not ownership — both sides
 * of a conversation can see everything attached to it, which is what
 * makes a chat a chat.
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
  /**
   * Paginates Attachments. `participantIdentityId` restricts the page
   * (and its `total`) to Attachments hanging off Chats that Identity
   * takes part in — files shared in a private conversation were never
   * meant to be listable by everyone.
   */
  list(
    page: number,
    pageSize: number,
    participantIdentityId?: IdentityId,
  ): Promise<PaginatedResult<Attachment>>;
  /**
   * Free-text match against `fileName`, scoped to
   * `participantIdentityId` when given — same participation rule as
   * `list`.
   */
  search(
    term: string,
    participantIdentityId?: IdentityId,
  ): Promise<Attachment[]>;
  /**
   * The Identity ids allowed to see this Attachment: the participants
   * of the Chat its Message belongs to. Empty when the Attachment does
   * not exist. Used by `GetAttachmentUseCase` — the by-id route cannot
   * reuse the `list` scope, so the same rule is asked for explicitly.
   */
  findParticipantIdentityIds(id: AttachmentId): Promise<string[]>;
}
