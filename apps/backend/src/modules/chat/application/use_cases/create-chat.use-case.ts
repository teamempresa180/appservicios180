import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { ChatDto } from '../dto/chat.dto';
import { CreateChatCommand } from '../commands/create-chat.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateChatUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  execute(command: CreateChatCommand): Promise<ChatDto> {
    void this.chatRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
