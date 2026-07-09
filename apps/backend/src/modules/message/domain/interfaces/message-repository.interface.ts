import { Message } from '../entities/message.entity';
import { MessageId } from '../value-objects/message-id.value-object';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Message persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface MessageRepository {
  findById(id: MessageId): Promise<Message | null>;
  findByChatId(chatId: ChatId): Promise<Message[]>;
  findBySenderIdentityId(identityId: IdentityId): Promise<Message[]>;
  save(message: Message): Promise<void>;
}
