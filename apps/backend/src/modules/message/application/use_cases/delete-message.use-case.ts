import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { MessageRepository } from '../../domain/interfaces/message-repository.interface';
import { MessageId } from '../../domain/value-objects/message-id.value-object';
import { DeleteMessageCommand } from '../commands/delete-message.command';

/**
 * Deletes an existing Message. No cascade rule is documented for what
 * happens to `Attachment` records referencing this `MessageId` — same
 * criterion as every other `Delete*UseCase`.
 *
 * Only the Identity that sent the message may delete it (or an Admin).
 * Participation in the Chat is deliberately not enough: the other side
 * of a conversation must not be able to erase what was said to it.
 */
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(command: DeleteMessageCommand): Promise<void> {
    const id = MessageId.fromString(command.id);
    const existing = await this.messageRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Message ${command.id} not found`);
    }
    if (
      command.caller.role !== Role.Admin &&
      existing.senderIdentityId.value !== command.caller.id
    ) {
      throw new ForbiddenException(
        `Message ${command.id} can only be deleted by its sender`,
      );
    }
    await this.messageRepository.delete(id);
  }
}
