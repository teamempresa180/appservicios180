import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageDto } from '../dto/message.dto';
import { SendMessageCommand } from '../commands/send-message.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class SendMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  execute(command: SendMessageCommand): Promise<MessageDto> {
    void this.messageRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
