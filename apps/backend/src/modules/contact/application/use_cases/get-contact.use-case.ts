import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactDto } from '../dto/contact.dto';
import { GetContactQuery } from '../queries/get-contact.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  execute(query: GetContactQuery): Promise<ContactDto | null> {
    void this.contactRepository;
    throw new Error(
      `GetContactUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
