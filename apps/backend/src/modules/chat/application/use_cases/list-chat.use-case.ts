import { PaginatedResult } from '../../../core/application/paginated-result';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ListChatQuery } from '../queries/list-chat.query';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatParticipationService } from '../services/chat-participation.service';

/**
 * Lists Chats page by page, restricted to the conversations the caller
 * takes part in — as the client or as the provider. Only an Admin gets
 * an unscoped listing. Previously this returned every Chat in the
 * system to any authenticated caller.
 */
export class ListChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: ListChatQuery): Promise<PaginatedResult<ChatDto>> {
    const scope = await this.participation.scopeFor(query.caller);
    const result = await this.chatRepository.list(
      query.page,
      query.pageSize,
      scope,
    );
    return {
      items: result.items.map((chat) => ChatMapper.toDto(chat)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
