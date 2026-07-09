import { Contact } from '../../domain/entities/contact.entity';
import { ContactDto } from '../dto/contact.dto';

/**
 * Translates between the Contact domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ContactMapper {
  static toDto(contact: Contact): ContactDto {
    const dto = new ContactDto();
    dto.id = contact.id.value;
    dto.identityId = contact.identityId.value;
    dto.type = contact.type;
    dto.value = contact.value;
    dto.status = contact.status;
    dto.createdAt = contact.createdAt;
    dto.updatedAt = contact.updatedAt;
    return dto;
  }
}
