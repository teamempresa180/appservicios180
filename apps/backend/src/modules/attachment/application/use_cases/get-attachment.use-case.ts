import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { isAdmin } from '../../../core/application/ownership';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { AttachmentId } from '../../domain/value-objects/attachment-id.value-object';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';
import { GetAttachmentQuery } from '../queries/get-attachment.query';

/**
 * Fetches a single Attachment by id, returning `null` when not found
 * — matches the `Promise<AttachmentDto | null>` signature already
 * declared for this use case, which `AttachmentController` turns into
 * a 404.
 *
 * A found Attachment is only returned to a participant of the Chat it
 * belongs to; anyone else gets `ForbiddenException`. This cannot reuse
 * `assertOwnership` like the other modules do — an Attachment has no
 * single owner Identity, it has an audience of two — so the audience
 * is asked for explicitly and the caller must be in it.
 */
export class GetAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(query: GetAttachmentQuery): Promise<AttachmentDto | null> {
    const id = AttachmentId.fromString(query.id);
    const attachment = await this.attachmentRepository.findById(id);
    if (!attachment) {
      return null;
    }

    if (!isAdmin(query.caller)) {
      const participants =
        await this.attachmentRepository.findParticipantIdentityIds(id);
      if (!participants.includes(query.caller.id)) {
        throw new ForbiddenException(
          'Attachment belongs to a Chat the authenticated Identity does not take part in',
        );
      }
    }

    return AttachmentMapper.toDto(attachment);
  }
}
