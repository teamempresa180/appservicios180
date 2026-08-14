import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { GetContactQuery } from '../queries/get-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/**
 * Fetches a single Contact by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase` — and
 * `ForbiddenException` when the Contact belongs to another Identity,
 * so a guessed id cannot be used to read someone else's email or
 * phone number.
 */
export class GetContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(query: GetContactQuery): Promise<ContactDto> {
    const contact = await this.contactRepository.findById(
      ContactId.fromString(query.id),
    );
    if (!contact) {
      throw new NotFoundException(`Contact ${query.id} not found`);
    }
    assertOwnership(query.caller, contact.identityId.value, 'Contact');
    return ContactMapper.toDto(contact);
  }
}
