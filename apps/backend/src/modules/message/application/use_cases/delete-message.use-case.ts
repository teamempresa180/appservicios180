import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { DeleteMessageCommand } from '../commands/delete-message.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  execute(command: DeleteMessageCommand): Promise<void> {
    void this.messageRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
