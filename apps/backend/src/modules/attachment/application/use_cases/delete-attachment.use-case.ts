import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { DeleteAttachmentCommand } from '../commands/delete-attachment.command';

/**
 * Deletes an existing Attachment. No cascade rule is documented —
 * same criterion as every other `Delete*UseCase`.
 */
export class DeleteAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(command: DeleteAttachmentCommand): Promise<void> {
    const id = AttachmentId.fromString(command.id);
    const existing = await this.attachmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Attachment ${command.id} not found`);
    }
    await this.attachmentRepository.delete(id);
  }
}
