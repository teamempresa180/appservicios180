import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatDto } from '../dto/chat.dto';
import { GetChatQuery } from '../queries/get-chat.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  execute(query: GetChatQuery): Promise<ChatDto | null> {
    void this.chatRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
