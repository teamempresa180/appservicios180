import { PaginatedResult } from '../../../core/application/paginated-result';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ListChatQuery } from '../queries/list-chat.query';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';

/** Lists Chats page by page. */
export class ListChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(query: ListChatQuery): Promise<PaginatedResult<ChatDto>> {
    const result = await this.chatRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((chat) => ChatMapper.toDto(chat)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
