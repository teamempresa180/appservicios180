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

/**
 * Identifies the two sides a caller may occupy in a Chat: the client
 * (`clientIdentityId`, always known for an authenticated caller) and
 * the provider (`providerId`, `null` when the caller has no Provider
 * record). Passing one to `list`/`search` restricts the result set to
 * conversations the caller actually takes part in — without it those
 * two methods would return every Chat in the system.
 */
export interface ChatParticipantScope {
  clientIdentityId: IdentityId;
  providerId: ProviderId | null;
}

export interface ChatRepository {
  findById(id: ChatId): Promise<Chat | null>;
  findByOrderId(orderId: OrderId): Promise<Chat[]>;
  findByClientIdentityId(identityId: IdentityId): Promise<Chat[]>;
  findByProviderId(providerId: ProviderId): Promise<Chat[]>;
  save(chat: Chat): Promise<void>;
  /** `scope` `null` means "no restriction" — reserved for Admin callers. */
  list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Chat>>;
  /** Free-text match against `type`, restricted to `scope` when given. */
  search(term: string, scope: ChatParticipantScope | null): Promise<Chat[]>;
}
