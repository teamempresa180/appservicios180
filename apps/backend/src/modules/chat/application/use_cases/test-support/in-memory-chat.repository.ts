import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { OrderId } from '../../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Chat } from '../../../domain/entities/chat.entity';
import {
  ChatParticipantScope,
  ChatRepository,
} from '../../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../../domain/value-objects/chat-id.value-object';

/** In-memory `ChatRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryChatRepository implements ChatRepository {
  private readonly rows = new Map<string, Chat>();

  findById(id: ChatId): Promise<Chat | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByOrderId(orderId: OrderId): Promise<Chat[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.orderId.equals(orderId)),
    );
  }

  findByClientIdentityId(identityId: IdentityId): Promise<Chat[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.clientIdentityId.equals(identityId),
      ),
    );
  }

  findByProviderId(providerId: ProviderId): Promise<Chat[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  save(chat: Chat): Promise<void> {
    this.rows.set(chat.id.value, chat);
    return Promise.resolve();
  }

  private static matches(row: Chat, scope: ChatParticipantScope | null): boolean {
    if (!scope) {
      return true;
    }
    return (
      row.clientIdentityId.value === scope.clientIdentityId.value ||
      (scope.providerId !== null &&
        row.providerId.value === scope.providerId.value)
    );
  }

  list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Chat>> {
    const all = [...this.rows.values()].filter((row) =>
      InMemoryChatRepository.matches(row, scope),
    );
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string, scope: ChatParticipantScope | null): Promise<Chat[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.type.toLowerCase().includes(lower) &&
          InMemoryChatRepository.matches(row, scope),
      ),
    );
  }
}
