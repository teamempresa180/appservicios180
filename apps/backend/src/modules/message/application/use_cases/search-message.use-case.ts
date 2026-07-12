import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { SearchMessageQuery } from '../queries/search-message.query';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';

/** Free-text search over `content`. */
export class SearchMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(query: SearchMessageQuery): Promise<MessageDto[]> {
    const results = await this.messageRepository.search(query.term);
    return results.map((message) => MessageMapper.toDto(message));
  }
}
