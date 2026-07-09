import { Contact } from './contact.entity';
import { ContactId } from '../value-objects/contact-id.value-object';
import { ContactType } from '../value-objects/contact-type.value-object';
import { ContactStatus } from '../value-objects/contact-status.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

describe('Contact', () => {
  it('holds all the assigned properties', () => {
    const id = ContactId.create();
    const identityId = IdentityId.create();
    const now = new Date();
    const contact = new Contact(id, {
      identityId,
      type: ContactType.Email,
      value: 'ana@example.com',
      status: ContactStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    expect(contact.id).toBe(id);
    expect(contact.identityId).toBe(identityId);
    expect(contact.type).toBe(ContactType.Email);
    expect(contact.value).toBe('ana@example.com');
  });
});
