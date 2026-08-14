import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatId } from '../../domain/value-objects/chat-id.value-object';
import { ChatDto } from '../dto/chat.dto';
import { ChatMapper } from '../mappers/chat.mapper';
import { GetChatQuery } from '../queries/get-chat.query';
import { ChatParticipationService } from '../services/chat-participation.service';

/**
 * Fetches a single Chat by id, returning `null` when not found —
 * matches the `Promise<ChatDto | null>` signature already declared
 * for this use case.
 *
 * A found Chat is only returned to one of its two participants (or an
 * Admin); anybody else gets `ForbiddenException`. Reading a stranger's
 * conversation metadata is the entry point to reading its messages.
 */
export class GetChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly participation: ChatParticipationService,
  ) {}

  async execute(query: GetChatQuery): Promise<ChatDto | null> {
    const chat = await this.chatRepository.findById(
      ChatId.fromString(query.id),
    );
    if (!chat) {
      return null;
    }
    await this.participation.assertParticipant(chat, query.caller);
    return ChatMapper.toDto(chat);
  }
}
