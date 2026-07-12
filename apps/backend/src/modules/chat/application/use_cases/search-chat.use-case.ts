import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { SearchChatQuery } from '../queries/search-chat.query';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';

/** Free-text search over `type`. */
export class SearchChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(query: SearchChatQuery): Promise<ChatDto[]> {
    const results = await this.chatRepository.search(query.term);
    return results.map((chat) => ChatMapper.toDto(chat));
  }
}
