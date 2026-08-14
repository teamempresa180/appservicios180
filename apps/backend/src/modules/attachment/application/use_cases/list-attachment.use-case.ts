import { PaginatedResult } from '../../../core/application/paginated-result';
import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { ListAttachmentQuery } from '../queries/list-attachment.query';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';

/**
 * Lists the Attachments visible to the caller page by page — those
 * hanging off Chats the caller takes part in. The scope is applied in
 * the repository query (not filtered after the fact) so `total` and
 * the page window both describe the caller's own conversations; the
 * unscoped listing handed every file shared on the platform to any
 * authenticated caller.
 *
 * Note this is participation, not authorship: the mobile chat view
 * lists a conversation's attachments and then matches them to
 * messages, so hiding the peer's files would break a working screen.
 * An `Admin` caller lists every Attachment.
 */
export class ListAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(
    query: ListAttachmentQuery,
  ): Promise<PaginatedResult<AttachmentDto>> {
    const scope = ownershipScope(query.caller);
    const result = await this.attachmentRepository.list(
      query.page,
      query.pageSize,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return {
      items: result.items.map((attachment) =>
        AttachmentMapper.toDto(attachment),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
