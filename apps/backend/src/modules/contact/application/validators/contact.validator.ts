import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { UpdateContactCommand } from '../commands/update-contact.command';

/**
 * Structural validation for Contact commands — required fields,
 * well-formed values. No business rules (e.g. no email/phone format
 * validation — nothing in `contact/domain` documents either as a real
 * invariant, and no uniqueness-per-Identity check — the repository
 * contract's `findByIdentityId` returns `Contact[]`, so multiple
 * contacts per Identity are allowed).
 */
export class ContactValidator {
  static validateCreate(command: CreateContactCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!Object.values(ContactType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(ContactType).join(', ')}`,
      );
    }
    if (!command.value?.trim()) {
      throw new ValidationException('value is required');
    }
  }

  static validateUpdate(command: UpdateContactCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.value !== undefined && !command.value.trim()) {
      throw new ValidationException('value cannot be blank');
    }
    if (
      command.status !== undefined &&
      !Object.values(ContactStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(ContactStatus).join(', ')}`,
      );
    }
  }
}
