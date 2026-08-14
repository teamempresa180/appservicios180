import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { MessageRepository } from '../../../message/domain/interfaces/message-repository.interface';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { DeleteAttachmentCommand } from '../commands/delete-attachment.command';

/**
 * Deletes an existing Attachment. No cascade rule is documented —
 * same criterion as every other `Delete*UseCase`.
 *
 * Only the sender of the Attachment's Message may delete it: deleting
 * is a mutation, so it follows authorship rather than the wider
 * participation rule that governs reading (see
 * `CreateAttachmentUseCase`). The Message is looked up through
 * `MessageRepository` because an Attachment carries only a
 * `messageId`, not the sender.
 */
export class DeleteAttachmentUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async execute(command: DeleteAttachmentCommand): Promise<void> {
    const id = AttachmentId.fromString(command.id);
    const existing = await this.attachmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Attachment ${command.id} not found`);
    }

    const message = await this.messageRepository.findById(existing.messageId);
    if (!message) {
      throw new NotFoundException(
        `Message ${existing.messageId.value} not found`,
      );
    }
    assertOwnership(
      command.caller,
      message.senderIdentityId.value,
      'Attachment',
    );

    await this.attachmentRepository.delete(id);
  }
}
