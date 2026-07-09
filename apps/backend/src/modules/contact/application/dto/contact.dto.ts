import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ContactDto {
  id!: string;
  identityId!: string;
  type!: ContactType;
  value!: string;
  status!: ContactStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
