import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { SearchContactQuery } from '../queries/search-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/** Free-text search over `value`. */
export class SearchContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: SearchContactQuery): Promise<ContactDto[]> {
    const results = await this.contactRepository.search(query.term);
    return results.map((contact) => ContactMapper.toDto(contact));
  }
}
