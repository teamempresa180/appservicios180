import { PaginatedResult } from '../../../core/application/paginated-result';
import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { ListAttachmentQuery } from '../queries/list-attachment.query';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';

/** Lists Attachments page by page. */
export class ListAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(
    query: ListAttachmentQuery,
  ): Promise<PaginatedResult<AttachmentDto>> {
    const result = await this.attachmentRepository.list(
      query.page,
      query.pageSize,
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
