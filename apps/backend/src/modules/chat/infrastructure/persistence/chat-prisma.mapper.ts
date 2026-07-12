import { ChatModel as PrismaChat } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * Translates between the `Chat` domain entity and its Prisma row
 * shape (`ChatModel`, mapped to the `chats` table). The only place
 * in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ChatPrismaMapper {
  static toDomain(row: PrismaChat): Chat {
    return new Chat(ChatId.fromString(row.id), {
      orderId: OrderId.fromString(row.orderId),
      clientIdentityId: IdentityId.fromString(row.clientIdentityId),
      providerId: ProviderId.fromString(row.providerId),
      status: row.status as unknown as ChatStatus,
      type: row.type as unknown as ChatType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(chat: Chat): PrismaChat {
    return {
      id: chat.id.value,
      orderId: chat.orderId.value,
      clientIdentityId: chat.clientIdentityId.value,
      providerId: chat.providerId.value,
      status: chat.status,
      type: chat.type,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
