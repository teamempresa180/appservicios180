import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { DeleteMessageCommand } from '../commands/delete-message.command';

/**
 * Deletes an existing Message. No cascade rule is documented for what
 * happens to `Attachment` records referencing this `MessageId` — same
 * criterion as every other `Delete*UseCase`.
 */
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(command: DeleteMessageCommand): Promise<void> {
    const id = MessageId.fromString(command.id);
    const existing = await this.messageRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Message ${command.id} not found`);
    }
    await this.messageRepository.delete(id);
  }
}
