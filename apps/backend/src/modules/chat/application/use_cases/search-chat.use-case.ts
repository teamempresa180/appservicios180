import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { SearchChatQuery } from '../queries/search-chat.query';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatParticipationService } from '../services/chat-participation.service';

/**
 * Free-text search over `type`, restricted to the conversations the
 * caller takes part in. Only an Admin searches across every Chat —
 * otherwise `/chats/search` would be an unscoped read of the whole
 * table under a different name.
 */
export class SearchChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: SearchChatQuery): Promise<ChatDto[]> {
    const scope = await this.participation.scopeFor(query.caller);
    const results = await this.chatRepository.search(query.term, scope);
    return results.map((chat) => ChatMapper.toDto(chat));
  }
}
