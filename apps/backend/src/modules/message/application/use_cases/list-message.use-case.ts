import { PaginatedResult } from '../../../core/application/paginated-result';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { ListMessageQuery } from '../queries/list-message.query';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';

/** Lists Messages page by page. */
export class ListMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(query: ListMessageQuery): Promise<PaginatedResult<MessageDto>> {
    const result = await this.messageRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((message) => MessageMapper.toDto(message)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
