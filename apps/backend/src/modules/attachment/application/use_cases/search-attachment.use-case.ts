import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { SearchAttachmentQuery } from '../queries/search-attachment.query';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';

/**
 * Free-text search over `fileName`, restricted to Chats the caller
 * takes part in — same participation rule as
 * `ListAttachmentUseCase`, so search can't be used to walk around the
 * listing's scope and enumerate other people's file names.
 */
export class SearchAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(query: SearchAttachmentQuery): Promise<AttachmentDto[]> {
    const scope = ownershipScope(query.caller);
    const results = await this.attachmentRepository.search(
      query.term,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return results.map((attachment) => AttachmentMapper.toDto(attachment));
  }
}
