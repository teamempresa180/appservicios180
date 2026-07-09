import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * Input shape for updating a Contact. No validation.
 */
export class UpdateContactDto {
  value?: string;
  status?: ContactStatus;
}
