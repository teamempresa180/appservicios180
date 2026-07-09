import { Contact } from '../entities/contact.entity';
import { ContactId } from '../value-objects/contact-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Contact persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ContactRepository {
  findById(id: ContactId): Promise<Contact | null>;
  findByIdentityId(identityId: IdentityId): Promise<Contact[]>;
  save(contact: Contact): Promise<void>;
}
