import { PaginatedResult } from '../../../core/application/paginated-result';
import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ListContactQuery } from '../queries/list-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/**
 * Lists the caller's own Contacts page by page. The scope is applied
 * in the repository query (not filtered after the fact) so `total` and
 * the page window both describe the caller's own records only — the
 * unscoped listing handed every user's email addresses and phone
 * numbers to any authenticated caller. An `Admin` caller lists every
 * Contact.
 */
export class ListContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: ListContactQuery): Promise<PaginatedResult<ContactDto>> {
    const scope = ownershipScope(query.caller);
    const result = await this.contactRepository.list(
      query.page,
      query.pageSize,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return {
      items: result.items.map((contact) => ContactMapper.toDto(contact)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
