import { PaginatedResult } from '../../../core/application/paginated-result';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ListContactQuery } from '../queries/list-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/** Lists Contacts page by page. */
export class ListContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: ListContactQuery): Promise<PaginatedResult<ContactDto>> {
    const result = await this.contactRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((contact) => ContactMapper.toDto(contact)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
