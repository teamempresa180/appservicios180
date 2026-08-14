import { PaginatedResult } from '../../../../core/application/paginated-result';
import { ChatId } from '../../../../chat/domain/value-objects/chat-id.value-object';
import {
  ChatParticipantScope,
  ChatRepository,
} from '../../../../chat/domain/interfaces/chat-repository.interface';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../../domain/entities/message.entity';
import { MessageRepository } from '../../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../../domain/value-objects/message-id.value-object';

/**
 * In-memory `MessageRepository` fake — see `InMemoryIdentityRepository`.
 *
 * `list`/`search` are participant-scoped in production by joining to
 * the Chat row, so the fake needs a `ChatRepository` to reproduce that
 * join. It is optional: a fake constructed without one behaves as if
 * no Chat existed, which fails closed (an empty scoped result) rather
 * than leaking.
 */
export class InMemoryMessageRepository implements MessageRepository {
  private readonly rows = new Map<string, Message>();

  constructor(private readonly chatRepository?: ChatRepository) {}

  findById(id: MessageId): Promise<Message | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByChatId(chatId: ChatId): Promise<Message[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) => row.chatId.equals(chatId)),
    );
  }

  findBySenderIdentityId(identityId: IdentityId): Promise<Message[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.senderIdentityId.equals(identityId),
      ),
    );
  }

  save(message: Message): Promise<void> {
    this.rows.set(message.id.value, message);
    return Promise.resolve();
  }

  delete(id: MessageId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  private async visible(
    rows: Message[],
    scope: ChatParticipantScope | null,
  ): Promise<Message[]> {
    if (!scope) {
      return rows;
    }
    const allowed: Message[] = [];
    for (const row of rows) {
      const chat = await this.chatRepository?.findById(row.chatId);
      if (!chat) {
        continue;
      }
      if (
        chat.clientIdentityId.value === scope.clientIdentityId.value ||
        (scope.providerId !== null &&
          chat.providerId.value === scope.providerId.value)
      ) {
        allowed.push(row);
      }
    }
    return allowed;
  }

  async list(
    page: number,
    pageSize: number,
    scope: ChatParticipantScope | null,
  ): Promise<PaginatedResult<Message>> {
    const all = await this.visible([...this.rows.values()], scope);
    const start = (page - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    };
  }

  async search(
    term: string,
    scope: ChatParticipantScope | null,
  ): Promise<Message[]> {
    const lower = term.toLowerCase();
    const matching = [...this.rows.values()].filter((row) =>
      row.content.toLowerCase().includes(lower),
    );
    return this.visible(matching, scope);
  }
}
