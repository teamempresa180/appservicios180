import { PaginatedResult } from '../../../../core/application/paginated-result';
import { ChatId } from '../../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Message } from '../../../domain/entities/message.entity';
import { MessageRepository } from '../../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../../domain/value-objects/message-id.value-object';

/** In-memory `MessageRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryMessageRepository implements MessageRepository {
  private readonly rows = new Map<string, Message>();

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

  list(page: number, pageSize: number): Promise<PaginatedResult<Message>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Message[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.content.toLowerCase().includes(lower),
      ),
    );
  }
}
