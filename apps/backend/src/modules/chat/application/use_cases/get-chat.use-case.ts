import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { GetChatQuery } from '../queries/get-chat.query';

/**
 * Fetches a single Chat by id, returning `null` when not found —
 * matches the `Promise<ChatDto | null>` signature already declared
 * for this use case.
 */
export class GetChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(query: GetChatQuery): Promise<ChatDto | null> {
    const chat = await this.chatRepository.findById(
      ChatId.fromString(query.id),
    );
    return chat ? ChatMapper.toDto(chat) : null;
  }
}
