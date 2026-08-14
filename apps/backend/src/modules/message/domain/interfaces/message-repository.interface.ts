import { PaginatedResult } from '../../../core/application/paginated-result';
import { Message } from '../entities/message.entity';
import { MessageId } from '../value-objects/message-id.value-object';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { ChatParticipantScope } from '../../../chat/domain/interfaces/chat-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Message persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 10: `PrismaMessageRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `MessageRepository` implementation by contract
 *  instead of by concrete class. */
export const MESSAGE_REPOSITORY = Symbol('MessageRepository');

export interface MessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChatId(chatId: ChatId): Promise<Message[]>;
  findBySenderIdentityId(identityId: IdentityId): Promise<Message[]>;
  save(message: Message): Promise<void>;
  delete(id: MessageId): Promise<void>;
  /**
   * `scope` restricts the page to Messages belonging to a Chat the
   * caller takes part in; `null` means "no restriction" and is
   * reserved for Admin callers. A message is as private as its
   * conversation, so this is the same scope the Chat module applies.
   */
  list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Message>>;
  /** Free-text match against `content`, restricted to `scope` when given. */
  search(term: string, scope: ChatParticipantScope | null): Promise<Message[]>;
}
