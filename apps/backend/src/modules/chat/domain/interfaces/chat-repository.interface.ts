import { PaginatedResult } from '../../../core/application/paginated-result';
import { Chat } from '../entities/chat.entity';
import { ChatId } from '../value-objects/chat-id.value-object';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Chat persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 10: `PrismaChatRepository`).
 *
 * No `delete()` — no `DeleteChatCommand` exists in the skeleton; only
 * `Create`/`Close` are offered.
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ChatRepository` implementation by contract
 *  instead of by concrete class. */
export const CHAT_REPOSITORY = Symbol('ChatRepository');

export interface ChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByOrderId(orderId: OrderId): Promise<Chat[]>;
  findByClientIdentityId(identityId: IdentityId): Promise<Chat[]>;
  findByProviderId(providerId: ProviderId): Promise<Chat[]>;
  save(chat: Chat): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Chat>>;
  /** Free-text match against `type`. */
  search(term: string): Promise<Chat[]>;
}
