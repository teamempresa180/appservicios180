import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentDto } from '../dto/attachment.dto';
import { GetAttachmentQuery } from '../queries/get-attachment.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  execute(query: GetAttachmentQuery): Promise<AttachmentDto | null> {
    void this.attachmentRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
