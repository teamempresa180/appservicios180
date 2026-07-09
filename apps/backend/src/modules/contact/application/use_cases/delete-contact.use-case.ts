import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { DeleteContactCommand } from '../commands/delete-contact.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  execute(command: DeleteContactCommand): Promise<void> {
    void this.contactRepository;
    throw new Error(
      `DeleteContactUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
