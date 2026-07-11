import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { UpdateContactCommand } from '../commands/update-contact.command';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';
import { ContactValidator } from '../validators/contact.validator';

/**
 * Updates the mutable fields of an existing Contact (`value`,
 * `status`) — `type` is not offered by `UpdateContactCommand` (only by
 * the immutable `type` set at creation), same pattern as
 * `UpdateIdentityUseCase` leaving identity-defining fields alone.
 */
export class UpdateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(command: UpdateContactCommand): Promise<ContactDto> {
    ContactValidator.validateUpdate(command);

    const id = ContactId.fromString(command.id);
    const existing = await this.contactRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Contact ${command.id} not found`);
    }

    const updated = new Contact(existing.id, {
      identityId: existing.identityId,
      type: existing.type,
      value: command.value ?? existing.value,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.contactRepository.save(updated);
    return ContactMapper.toDto(updated);
  }
}
