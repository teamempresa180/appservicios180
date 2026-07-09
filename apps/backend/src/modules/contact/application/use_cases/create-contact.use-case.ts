import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactDto } from '../dto/contact.dto';
import { CreateContactCommand } from '../commands/create-contact.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  execute(command: CreateContactCommand): Promise<ContactDto> {
    void this.contactRepository;
    throw new Error(
      `CreateContactUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
