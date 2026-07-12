import { AttachmentRepository } from '../../domain/interfaces/attachment-repository.interface';
import { SearchAttachmentQuery } from '../queries/search-attachment.query';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentMapper } from '../mappers/attachment.mapper';

/** Free-text search over `fileName`. */
export class SearchAttachmentUseCase {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async execute(query: SearchAttachmentQuery): Promise<AttachmentDto[]> {
    const results = await this.attachmentRepository.search(query.term);
    return results.map((attachment) => AttachmentMapper.toDto(attachment));
  }
}
