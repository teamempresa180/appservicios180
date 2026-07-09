import { Chat } from '../entities/chat.entity';
import { ChatId } from '../value-objects/chat-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Chat persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByOrderId(orderId: OrderId): Promise<Chat[]>;
  findByClientIdentityId(identityId: IdentityId): Promise<Chat[]>;
  findByProviderId(providerId: ProviderId): Promise<Chat[]>;
  save(chat: Chat): Promise<void>;
}
