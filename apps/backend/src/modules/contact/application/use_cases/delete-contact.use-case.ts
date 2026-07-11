import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { DeleteContactCommand } from '../commands/delete-contact.command';

/**
 * Deletes an existing Contact. No cascade rule is documented for what
 * happens to other data referencing this `ContactId` — none exists
 * today, so there is nothing to cascade.
 */
export class DeleteContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(command: DeleteContactCommand): Promise<void> {
    const id = ContactId.fromString(command.id);
    const existing = await this.contactRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Contact ${command.id} not found`);
    }
    await this.contactRepository.delete(id);
  }
}
