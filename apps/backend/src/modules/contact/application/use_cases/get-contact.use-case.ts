import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { GetContactQuery } from '../queries/get-contact.query';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';

/**
 * Fetches a single Contact by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`.
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
    return ContactMapper.toDto(contact);
  }
}
