import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { assertOwnership } from '../../../core/application/ownership';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../domain/value-objects/contact-id.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { ContactDto } from '../dto/contact.dto';
import { ContactMapper } from '../mappers/contact.mapper';
import { ContactValidator } from '../validators/contact.validator';

/**
 * Creates a new Contact channel for an existing Identity, always in
 * `Active` status. Depends on `IdentityRepository` (not just its own)
 * to verify the referenced Identity actually exists before creating a
 * contact for it — same rule already applied to `Authentication`/
 * `Credential`/`Profile`, since `Contact` also references `IdentityId`.
 *
 * The `identityId` in the command is caller-supplied, so it is checked
 * against the authenticated caller: a contact channel can only be
 * created for one's own Identity (an `Admin` may create it for
 * anyone).
 */
export class CreateContactUseCase {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateContactCommand): Promise<ContactDto> {
    ContactValidator.validateCreate(command);
    assertOwnership(command.caller, command.identityId, 'Contact');

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const contact = new Contact(ContactId.create(), {
      identityId,
      type: command.type,
      value: command.value,
      status: ContactStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.contactRepository.save(contact);
    return ContactMapper.toDto(contact);
  }
}
