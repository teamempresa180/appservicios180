import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageDto } from '../dto/message.dto';
import { GetMessageQuery } from '../queries/get-message.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  execute(query: GetMessageQuery): Promise<MessageDto | null> {
    void this.messageRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
