import { ChatParticipationService } from '../../../chat/application/services/chat-participation.service';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { SearchMessageQuery } from '../queries/search-message.query';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';

/**
 * Free-text search over `content`, restricted to the Chats the caller
 * takes part in. Unscoped, this was a full-text search across every
 * private conversation in the system — strictly worse than the
 * unscoped listing, since it let an attacker go looking for specific
 * words. Only an Admin searches globally.
 */
export class SearchMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: SearchMessageQuery): Promise<MessageDto[]> {
    const scope = await this.participation.scopeFor(query.caller);
    const results = await this.messageRepository.search(query.term, scope);
    return results.map((message) => MessageMapper.toDto(message));
  }
}
