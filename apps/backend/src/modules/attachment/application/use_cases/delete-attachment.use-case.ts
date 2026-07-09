import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { DeleteAttachmentCommand } from '../commands/delete-attachment.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  execute(command: DeleteAttachmentCommand): Promise<void> {
    void this.attachmentRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
