import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';
import { GetAttachmentQuery } from '../queries/get-attachment.query';

/**
 * Fetches a single Attachment by id, returning `null` when not found
 * — matches the `Promise<AttachmentDto | null>` signature already
 * declared for this use case.
 */
export class GetAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(query: GetAttachmentQuery): Promise<AttachmentDto | null> {
    const attachment = await this.attachmentRepository.findById(
      AttachmentId.fromString(query.id),
    );
    return attachment ? AttachmentMapper.toDto(attachment) : null;
  }
}
