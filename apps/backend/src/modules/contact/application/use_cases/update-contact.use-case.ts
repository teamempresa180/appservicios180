import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactDto } from '../dto/contact.dto';
import { UpdateContactCommand } from '../commands/update-contact.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  execute(command: UpdateContactCommand): Promise<ContactDto> {
    void this.contactRepository;
    throw new Error(
      `UpdateContactUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
