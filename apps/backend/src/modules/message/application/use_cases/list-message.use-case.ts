import { PaginatedResult } from '../../../core/application/paginated-result';
import { ChatParticipationService } from '../../../chat/application/services/chat-participation.service';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { ListMessageQuery } from '../queries/list-message.query';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';

/**
 * Lists Messages page by page, restricted to the Chats the caller
 * takes part in. Previously this endpoint returned the private
 * messages of every pair of users in the system to any authenticated
 * caller — the most severe read leak in this bounded context. Only an
 * Admin gets an unscoped listing.
 */
export class ListMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: ListMessageQuery): Promise<PaginatedResult<MessageDto>> {
    const scope = await this.participation.scopeFor(query.caller);
    const result = await this.messageRepository.list(
      query.page,
      query.pageSize,
      scope,
    );
    return {
      items: result.items.map((message) => MessageMapper.toDto(message)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
