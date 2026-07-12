import { PaginatedResult } from '../../../core/application/paginated-result';
import { Message } from '../entities/message.entity';
import { MessageId } from '../value-objects/message-id.value-object';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
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
  list(page: number, pageSize: number): Promise<PaginatedResult<Message>>;
  /** Free-text match against `content`. */
  search(term: string): Promise<Message[]>;
}
