import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * Input shape for creating a Contact. No validation.
 */
export class CreateContactDto {
  identityId!: string;
  type!: ContactType;
  value!: string;
}
