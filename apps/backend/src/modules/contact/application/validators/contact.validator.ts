import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactCommand } from '../commands/create-contact.command';
import { UpdateContactCommand } from '../commands/update-contact.command';

/**
 * One channel-specific shape per `ContactType`. `Other` is
 * deliberately unconstrained — the enum member exists precisely for
 * channels the domain does not model (a handle, an extension, an
 * internal reference), so there is no format to enforce.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * A phone number is checked in two steps rather than with one regex:
 * which characters are allowed at all, and how many of them are
 * actual digits. Separating the two keeps international formats
 * (`+57 300 123 4567`, `(601) 555-0001`) valid without the pattern
 * having to enumerate every punctuation layout.
 */
const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s().-]+$/;
const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 20;

/**
 * Structural validation for Contact commands — required fields,
 * well-formed values, plus the one cross-field business rule the
 * request DTOs cannot express: `value` must match the shape implied by
 * `type`. A `Contact` whose `type` is `EMAIL` but whose `value` is a
 * phone number is not a validation nicety — downstream delivery picks
 * its channel from `type`, so a mismatch silently sends nothing.
 *
 * No uniqueness-per-Identity check — the repository contract's
 * `findByIdentityId` returns `Contact[]`, so multiple contacts per
 * Identity are allowed.
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
    ContactValidator.validateValueForType(command.type, command.value);
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

  /**
   * Cross-field rule shared by create and update. `UpdateContactCommand`
   * carries no `type` (it is immutable after creation), so
   * `UpdateContactUseCase` calls this with the stored Contact's own
   * type once it has loaded the record.
   */
  static validateValueForType(type: ContactType, value: string): void {
    const trimmed = value.trim();

    if (type === ContactType.Email && !EMAIL_PATTERN.test(trimmed)) {
      throw new ValidationException(
        'value must be a valid email address when type is EMAIL',
      );
    }

    if (type === ContactType.Phone) {
      const digitCount = (trimmed.match(/\d/g) ?? []).length;
      if (
        !PHONE_ALLOWED_CHARACTERS.test(trimmed) ||
        digitCount < PHONE_MIN_DIGITS ||
        digitCount > PHONE_MAX_DIGITS
      ) {
        throw new ValidationException(
          `value must be a valid phone number (${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits, optionally with +, spaces, dashes or parentheses) when type is PHONE`,
        );
      }
    }
  }
}
