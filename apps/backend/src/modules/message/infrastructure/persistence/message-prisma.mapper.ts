import { MessageModel as PrismaMessage } from '@prisma/client';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../domain/entities/message.entity';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';
import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * Translates between the `Message` domain entity and its Prisma row
 * shape (`MessageModel`, mapped to the `messages` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class MessagePrismaMapper {
  static toDomain(row: PrismaMessage): Message {
    return new Message(MessageId.fromString(row.id), {
      chatId: ChatId.fromString(row.chatId),
      senderIdentityId: IdentityId.fromString(row.senderIdentityId),
      content: row.content,
      type: row.type as unknown as MessageType,
      status: row.status as unknown as MessageStatus,
      sentAt: row.sentAt,
      readAt: row.readAt,
    });
  }

  static toPersistence(message: Message): PrismaMessage {
    return {
      id: message.id.value,
      chatId: message.chatId.value,
      senderIdentityId: message.senderIdentityId.value,
      content: message.content,
      type: message.type,
      status: message.status,
      sentAt: message.sentAt,
      readAt: message.readAt,
    };
  }
}
