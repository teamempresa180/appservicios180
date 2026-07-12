import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { MessageDto } from '../dto/message.dto';
import { MessageMapper } from '../mappers/message.mapper';
import { GetMessageQuery } from '../queries/get-message.query';

/**
 * Fetches a single Message by id, returning `null` when not found —
 * matches the `Promise<MessageDto | null>` signature already declared
 * for this use case.
 */
export class GetMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(query: GetMessageQuery): Promise<MessageDto | null> {
    const message = await this.messageRepository.findById(
      MessageId.fromString(query.id),
    );
    return message ? MessageMapper.toDto(message) : null;
  }
}
