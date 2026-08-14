import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { SearchContactQuery } from '../queries/search-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/**
 * Free-text search over `value`, restricted to the caller's own
 * Contacts — same ownership rule as `ListContactUseCase`, so search
 * can't be used to walk around the listing's scope and harvest other
 * users' contact details.
 */
export class SearchContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: SearchContactQuery): Promise<ContactDto[]> {
    const scope = ownershipScope(query.caller);
    const results = await this.contactRepository.search(
      query.term,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return results.map((contact) => ContactMapper.toDto(contact));
  }
}
