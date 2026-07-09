import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentDto } from '../dto/attachment.dto';
import { CreateAttachmentCommand } from '../commands/create-attachment.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  execute(command: CreateAttachmentCommand): Promise<AttachmentDto> {
    void this.attachmentRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
